import { useState, useRef, useEffect, useCallback, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Wishes.module.css';
import { useLanguage } from '../../context/LanguageContext';
import { weddingData } from '../../data/wedding';

const REACTIONS = ['♥', '🥰', '🎉', '🌸', '🪔'];
const ACCENTS = ['accentGold', 'accentRose', 'accentJasmine', 'accentSlate'];

type Wish = { name: string; message: string; reaction: string };
type Burst = { id: number; emoji: string; x: number; y: number; scale: number; duration: number };

export default function Wishes() {
  const { t } = useLanguage();
  const copy = t.invitation.wishes;
  const [wishes, setWishes] = useState<Wish[]>(weddingData.wishes);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [reaction, setReaction] = useState(REACTIONS[0]);
  const [bursts, setBursts] = useState<Burst[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [thankYouName, setThankYouName] = useState<string | null>(null);
  const thankYouTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const feedRef = useRef<HTMLDivElement | null>(null);
  const pausedRef = useRef(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Gentle auto-scroll through the feed; pauses the moment a guest touches or hovers it.
  useEffect(() => {
    const feed = feedRef.current;
    if (!feed) return;
    const id = setInterval(() => {
      if (pausedRef.current) return;
      if (feed.scrollTop + feed.clientHeight >= feed.scrollHeight - 1) {
        feed.scrollTop = 0;
      } else {
        feed.scrollTop += 0.6;
      }
    }, 30);
    return () => clearInterval(id);
  }, []);

  const pause = useCallback(() => {
    pausedRef.current = true;
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
  }, []);

  const resumeSoon = useCallback(() => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      pausedRef.current = false;
    }, 2200);
  }, []);

  // Facebook-reels style burst: a little flurry of varied-size emojis flies up per tap.
  const handleReact = (emoji: string) => {
    const flurry: Burst[] = Array.from({ length: 5 + Math.floor(Math.random() * 3) }, () => ({
      id: Date.now() + Math.random(),
      emoji,
      x: (Math.random() - 0.5) * 70,
      y: Math.random() * 12,
      scale: 0.8 + Math.random() * 1.2,
      duration: 1.3 + Math.random() * 1.3,
    }));
    setBursts((prev) => [...prev, ...flurry]);
    setCounts((prev) => ({ ...prev, [emoji]: (prev[emoji] ?? 0) + 1 }));
    const ids = flurry.map((b) => b.id);
    setTimeout(() => setBursts((prev) => prev.filter((b) => !ids.includes(b.id))), 2800);
  };

  // NOTE: front-end only for now — connect to a real backend/API before going live.
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setWishes((prev) => [{ name, message, reaction }, ...prev]);
    setThankYouName(name);
    setName('');
    setMessage('');
    if (thankYouTimerRef.current) clearTimeout(thankYouTimerRef.current);
    thankYouTimerRef.current = setTimeout(() => setThankYouName(null), 4200);
  };

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
        <AnimatePresence>
          {bursts.map((b) => (
            <motion.span
              key={b.id}
              className={styles.burst}
              style={{ left: `calc(50% + ${b.x}px)`, fontSize: `${1.1 * b.scale}rem` }}
              initial={{ opacity: 1, y: 0, rotate: 0 }}
              animate={{ opacity: 0, y: -140 - b.y * 4, rotate: (b.x > 0 ? 1 : -1) * 25 }}
              exit={{ opacity: 0 }}
              transition={{ duration: b.duration, ease: 'easeOut' }}
            >
              {b.emoji}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>

      <div
        className={styles.wall}
        ref={feedRef}
        onMouseEnter={pause}
        onMouseLeave={resumeSoon}
        onTouchStart={pause}
        onTouchEnd={resumeSoon}
        onWheel={pause}
      >
        {wishes.map((wish, i) => (
          <motion.article
            key={`${wish.name}-${i}`}
            className={`${styles.card} ${styles[ACCENTS[i % ACCENTS.length]]}`}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: (i % 5) * 0.06 }}
          >
            <p className={styles.message}>{wish.message}</p>
            <p className={styles.author}>
              — {wish.name} <span className={styles.reaction}>{wish.reaction}</span>
            </p>
          </motion.article>
        ))}
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
            className={styles.form}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={copy.namePlaceholder}
              className={styles.input}
              required
            />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={copy.messagePlaceholder}
              className={styles.textarea}
              required
            />
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
            <button type="submit" className={styles.submit}>
              {copy.submit}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </section>
  );
}