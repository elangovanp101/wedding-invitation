import { useState, useRef, useCallback, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Wishes.module.css';
import { useLanguage } from '../../context/LanguageContext';
import { weddingData } from '../../data/wedding';

const REACTIONS = ['♥', '🥰', '🎉', '🌸', '🌿'];
const ACCENTS = ['accentGold', 'accentRose', 'accentJasmine', 'accentSlate'];
const MAX_MESSAGE_LENGTH = 160;
const SHOWER_LIFETIME_MS = 2800;

type Wish = { name: string; message: string; reaction: string };
type ShowerPiece = { id: number; left: number; delay: number; duration: number; drift: number; rotate: number };

function initial(name: string) {
  return name.trim().charAt(0).toUpperCase() || '✦';
}

/** Full-page shower of the tapped reaction, falling from the sky for a few seconds. */
function ReactionShower({ emoji }: { emoji: string }) {
  const pieces = useRef<ShowerPiece[]>(
    Array.from({ length: 34 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.6,
      duration: 2.2 + Math.random() * 1.4,
      drift: (Math.random() - 0.5) * 60,
      rotate: (Math.random() - 0.5) * 240,
    }))
  ).current;

  return (
    <div className={styles.shower} aria-hidden="true">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className={styles.showerPiece}
          style={{ left: `${p.left}%` }}
          initial={{ y: '-10vh', opacity: 0, rotate: 0 }}
          animate={{ y: '110vh', x: [0, p.drift], opacity: [0, 1, 1, 0], rotate: p.rotate }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
        >
          {emoji}
        </motion.span>
      ))}
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
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [showerEmoji, setShowerEmoji] = useState<string | null>(null);
  const [thankYouName, setThankYouName] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);
  const thankYouTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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

  // Fills the sky with the tapped reaction for a few seconds — replaces the old localized burst.
  const handleReact = useCallback((emoji: string) => {
    setCounts((prev) => ({ ...prev, [emoji]: (prev[emoji] ?? 0) + 1 }));
    setShowerEmoji(emoji);
    if (showerTimerRef.current) clearTimeout(showerTimerRef.current);
    showerTimerRef.current = setTimeout(() => setShowerEmoji(null), SHOWER_LIFETIME_MS);
  }, []);

  // NOTE: front-end only for now — connect to a real backend/API before going live.
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setWishes((prev) => [{ name, message: message.slice(0, MAX_MESSAGE_LENGTH), reaction }, ...prev]);
    setThankYouName(name);
    setName('');
    setMessage('');
    if (thankYouTimerRef.current) clearTimeout(thankYouTimerRef.current);
    thankYouTimerRef.current = setTimeout(() => setThankYouName(null), 4200);
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
            {counts[r] ? <span className={styles.reactCount}>{counts[r]}</span> : null}
          </button>
        ))}
      </div>

      {showerEmoji && <ReactionShower emoji={showerEmoji} />}

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
                disabled={!name.trim() || !message.trim()}
              >
                ➤
              </button>
            </div>
            <span className={styles.charCount}>
              {message.length}/{MAX_MESSAGE_LENGTH}
            </span>
          </motion.form>
        )}
      </AnimatePresence>
    </section>
  );
}