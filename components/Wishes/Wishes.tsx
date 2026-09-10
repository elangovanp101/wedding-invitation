import { useState, useRef, useCallback, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, addDoc, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import styles from './Wishes.module.css';
import lanternStyles from '../Fireworks/SkyLanterns.module.css';
import { useLanguage } from '../../context/LanguageContext';
import { weddingData } from '../../data/wedding';
import { db } from '../../lib/firebase';

const REACTIONS = ['♥', '🌸', '🎉', '🏮'];
const ACCENTS = ['accentGold', 'accentRose', 'accentJasmine', 'accentSlate'];
const CONFETTI_COLORS = ['#cda86b', '#e8d3a4', '#8f2a3a', '#f4ead9', '#5c7d6b', '#b9515f'];
const MAX_MESSAGE_LENGTH = 160;
const SHOWER_LIFETIME_MS = 2800;
const MAX_CONCURRENT_SHOWERS = 4;
const REACT_COOLDOWN_MS = 500;

type ShowerType = 'heart' | 'flower' | 'confetti' | 'lantern';

// Each reaction rains down its own themed shower instead of confetti for everything.
const SHOWER_TYPE: Record<string, ShowerType> = {
  '♥': 'heart',
  '🌸': 'flower',
  '🎉': 'confetti',
  '🏮': 'lantern',
};
const SHOWER_GLYPH: Record<'heart' | 'flower', string> = {
  heart: '♥',
  flower: '🌸',
};
// Sky lanterns cycle through the same warm hue variants as the Fireworks show's SkyLanterns.
const LANTERN_HUES = ['gold', 'rose', 'ivory'];

type Wish = { name: string; message: string; reaction: string };
type ShowerPiece = { id: number; left: number; delay: number; duration: number; drift: number; rotate: number; color: string; size: number };

function initial(name: string) {
  return name.trim().charAt(0).toUpperCase() || '✦';
}

/** Full-page shower themed to the reaction that was tapped — confetti paper for the party
 * popper, falling glyphs (heart/flower/fire) for the rest. Each tap spawns an independent
 * instance (keyed by id in the parent) so rapid clicks stack instead of one click's animation
 * silently overwriting the last. */
function ReactionShower({ type }: { type: ShowerType }) {
  const pieces = useRef<ShowerPiece[]>(
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: type === 'lantern' ? Math.random() * 1.6 : Math.random() * 0.6,
      duration: type === 'lantern' ? 6 + Math.random() * 2.5 : 2.2 + Math.random() * 1.4,
      drift: (Math.random() - 0.5) * 60,
      rotate: (Math.random() - 0.5) * 240,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      size: type === 'confetti' ? 6 + Math.random() * 8 : 14 + Math.random() * 14,
    }))
  ).current;

  return (
    <div className={styles.shower} aria-hidden="true">
      {pieces.map((p) => {
        if (type === 'confetti') {
          return (
            <motion.span
              key={p.id}
              className={styles.showerPiece}
              style={{ left: `${p.left}%`, width: p.size, height: p.size * 0.42, background: p.color }}
              initial={{ y: '-10vh', opacity: 0, rotate: 0 }}
              animate={{ y: '110vh', x: [0, p.drift], opacity: [0, 1, 1, 0], rotate: p.rotate }}
              transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
            />
          );
        }
        if (type === 'lantern') {
          const hue = LANTERN_HUES[p.id % LANTERN_HUES.length];
          return (
            <motion.div
              key={p.id}
              className={`${lanternStyles.lantern} ${lanternStyles[`hue-${hue}`]}`}
              // .lantern is CSS-anchored to bottom:0 (not top:0 like the other shower pieces) —
              // pinning top:0 here too neutralizes that so the y keyframes below are absolute
              // viewport offsets, not stacked on top of an extra +100vh baseline.
              style={{ left: `${p.left}%`, top: 0, width: p.size, height: p.size * 1.3 }}
              initial={{ y: '110vh', opacity: 0, x: 0 }}
              animate={{ y: '-20vh', opacity: [0, 1, 1, 0], x: [0, p.drift] }}
              transition={{ duration: p.duration, delay: p.delay, ease: 'easeOut' }}
            >
              <span className={lanternStyles.glow} />
              <span className={lanternStyles.flame} />
            </motion.div>
          );
        }
        return (
          <motion.span
            key={p.id}
            className={`${styles.showerGlyph} ${type === 'heart' ? styles.glyphHeart : ''}`}
            style={{ left: `${p.left}%`, fontSize: p.size }}
            initial={{ y: '-10vh', opacity: 0, rotate: 0 }}
            animate={{ y: '110vh', x: [0, p.drift], opacity: [0, 1, 1, 0], rotate: p.rotate }}
            transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
          >
            {SHOWER_GLYPH[type]}
          </motion.span>
        );
      })}
    </div>
  );
}

export default function Wishes() {
  const { t } = useLanguage();
  const copy = t.invitation.wishes;
  const [wishes, setWishes] = useState<Wish[]>(weddingData.wishes);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [reaction, setReaction] = useState(REACTIONS[0]);
  const [bursts, setBursts] = useState<{ id: number; type: ShowerType }[]>([]);
  const [thankYouName, setThankYouName] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const thankYouTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const burstIdRef = useRef(0);
  const lastReactAtRef = useRef(0);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const tickerRef = useRef<HTMLDivElement | null>(null);
  const pausedRef = useRef(false);

  // Auto-scrolls the ticker via real scrollLeft (so the native horizontal scrollbar always
  // reflects position and the guest can grab it to scroll manually), looping seamlessly since
  // the wish list below is duplicated once.
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    let frame: number;
    const step = () => {
      const el = tickerRef.current;
      if (el && !pausedRef.current) {
        el.scrollLeft += 0.6;
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft = 0;
        }
      }
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, []);

  // Auto-grows the message box as the guest types, instead of a small fixed box with a scrollbar.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [message]);

  // Fills the sky with a shower themed to the type given, for a few seconds — each call spawns
  // its own independent burst (by id) so rapid triggers stack instead of one silently
  // overwriting the last. Lanterns rise much slower than the other showers, so they get longer
  // on screen before their burst unmounts, or they'd be cut off mid-flight.
  const triggerShower = useCallback((type: ShowerType) => {
    const id = burstIdRef.current++;
    const lifetime = type === 'lantern' ? 9500 : SHOWER_LIFETIME_MS;
    setBursts((prev) => (prev.length >= MAX_CONCURRENT_SHOWERS ? prev : [...prev, { id, type }]));
    setTimeout(() => {
      setBursts((prev) => prev.filter((b) => b.id !== id));
    }, lifetime);
  }, []);

  // Guarded by a short cooldown so rapid/spam clicking can't pile up enough concurrent showers
  // to bog down or crash the page.
  const handleReact = useCallback(
    (emoji: string) => {
      const now = Date.now();
      if (now - lastReactAtRef.current < REACT_COOLDOWN_MS) return;
      lastReactAtRef.current = now;
      triggerShower(SHOWER_TYPE[emoji] ?? 'confetti');
    },
    [triggerShower]
  );

  // Live-syncs the wish list from Firestore once db/wedding.ts is configured with real keys —
  // until then `db` is null and the page just keeps showing the local seed wishes below.
  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, 'wishes'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      setWishes(snapshot.docs.map((doc) => doc.data() as Wish));
    });
  }, []);

  // NOTE: writes to Firestore once configured; otherwise falls back to local-only state so the
  // form still works (wishes just won't persist or be visible to other guests) before Firebase
  // is set up.
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim() || submitting) return;
    const newWish: Wish = { name, message: message.slice(0, MAX_MESSAGE_LENGTH), reaction };
    setSubmitting(true);
    setSubmitError(null);
    try {
      if (db) {
        await addDoc(collection(db, 'wishes'), { ...newWish, createdAt: serverTimestamp() });
      } else {
        setWishes((prev) => [newWish, ...prev]);
      }
      setThankYouName(name);
      setName('');
      setMessage('');
      triggerShower('lantern');
      if (thankYouTimerRef.current) clearTimeout(thankYouTimerRef.current);
      thankYouTimerRef.current = setTimeout(() => setThankYouName(null), 4200);
    } catch (err) {
      console.error('Failed to save wish:', err);
      setSubmitError("Couldn't send that — please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Duplicated once so the CSS marquee loop is seamless — no scroll container involved,
  // so this can never trap page scrolling on mobile.
  const ticker = wishes.length ? [...wishes, ...wishes] : [];

  return (
    <section id="wishes" className={styles.section}>
      <h2 className={styles.title}>{copy.title}</h2>
      <p className={styles.subtitle}>{copy.subtitle}</p>

      <div className={styles.reactBar}>
        {REACTIONS.map((r, i) => (
          <button
            key={r}
            type="button"
            className={styles.reactButton}
            style={{ animationDelay: `${i * 0.3}s` }}
            onClick={() => handleReact(r)}
            aria-label={`React with ${r}`}
          >
            <span className={styles.reactEmoji}>{r}</span>
          </button>
        ))}
      </div>

      {bursts.map((b) => (
        <ReactionShower key={b.id} type={b.type} />
      ))}

      {/* Instagram-style ticker: small post chips, scrollable by hand (visible scrollbar)
          and gently auto-scrolling otherwise; 2-3 visible at once. */}
      <div
        ref={tickerRef}
        className={styles.tickerViewport}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
      >
        <div className={styles.tickerTrack}>
          {ticker.map((wish, i) => (
            <article key={`${wish.name}-${i}`} className={`${styles.card} ${styles[ACCENTS[i % ACCENTS.length]]}`}>
              <span className={styles.avatar}>{initial(wish.name)}</span>
              <div className={styles.cardBody}>
                <p className={styles.author}>
                  {wish.name} <span className={styles.reaction}>{wish.reaction}</span>
                </p>
                <p className={styles.message}>{wish.message}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {thankYouName ? (
          <motion.div
            key="thanks"
            className={styles.thankYou}
            initial={{ opacity: 0, scale: 0.92, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.span
              className={styles.thankYouSparkle}
              animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.1, 0.9] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              ✦
            </motion.span>
            <p className={styles.thankYouText}>Thank you, {thankYouName}</p>
            <p className={styles.thankYouSub}>See you at the wedding ✦</p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            className={styles.composer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className={styles.reactions}>
              {REACTIONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  className={`${styles.reactionButton} ${reaction === r ? styles.reactionActive : ''}`}
                  onClick={() => setReaction(r)}
                  aria-pressed={reaction === r}
                  aria-label={`React with ${r}`}
                >
                  {r}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={copy.namePlaceholder}
              className={styles.nameInput}
              maxLength={40}
              required
            />

            <div className={styles.commentRow}>
              <span className={styles.avatarSmall} aria-hidden="true">
                {initial(name)}
              </span>
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, MAX_MESSAGE_LENGTH))}
                placeholder={copy.messagePlaceholder}
                className={styles.commentInput}
                maxLength={MAX_MESSAGE_LENGTH}
                rows={2}
                required
              />
              <button
                type="submit"
                className={styles.sendButton}
                aria-label={copy.submit}
                disabled={!name.trim() || !message.trim() || submitting}
              >
                ➤
              </button>
            </div>
            <span className={styles.charCount}>
              {message.length}/{MAX_MESSAGE_LENGTH}
            </span>
            {submitError ? <span className={styles.submitError}>{submitError}</span> : null}
          </motion.form>
        )}
      </AnimatePresence>
    </section>
  );
}