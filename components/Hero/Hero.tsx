import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import styles from './Hero.module.css';
import PetalField from './PetalField';
import CarCrashIntro, { CAR_CRASH_DURATION_MS } from './CarCrashIntro';
import HandwrittenName from '../HandwrittenName/HandwrittenName';
import { useLanguage } from '../../context/LanguageContext';
import { useMusic } from '../../context/MusicContext';

const MUSIC_START_DELAY_MS = 50;
const LANG_LOOP_MS = 3800;
const EASE = [0.22, 1, 0.36, 1] as const;

type Props = { onOpen: () => void };

export default function Hero({ onOpen }: Props) {
  const { t } = useLanguage();
  const music = useMusic();
  const reduceMotion = useReducedMotion();
  const [heroLang, setHeroLang] = useState<'en' | 'ta'>('en');
  const [introDone, setIntroDone] = useState(false);
  const openedRef = useRef(false);

  const handleOpen = useCallback(() => {
    if (openedRef.current) return;
    openedRef.current = true;
    // Retry in case the near-instant autoplay attempt on load was blocked — this click is a real gesture.
    music.start();
    onOpen();
  }, [music, onOpen]);

  // Music starts on its own almost immediately after the page loads — it doesn't wait for "Open Invitation".
  // If the browser blocks autoplay this early, it's retried above on click, and by MusicContext on any
  // other first interaction with the page.
  useEffect(() => {
    const timer = setTimeout(() => music.start(), MUSIC_START_DELAY_MS);
    return () => clearTimeout(timer);
  }, [music]);

  // Cinematic pre-intro: two cars race in and collide before the names appear.
  useEffect(() => {
    if (reduceMotion) {
      setIntroDone(true);
      return;
    }
    const timer = setTimeout(() => setIntroDone(true), CAR_CRASH_DURATION_MS);
    return () => clearTimeout(timer);
  }, [reduceMotion]);

  // Artistic bilingual identity: loops English/Tamil gently while the guest decides to open.
  // The gate now waits for the guest — there is no auto-open.
  useEffect(() => {
    if (reduceMotion) return;
    const interval = setInterval(() => {
      setHeroLang((prev) => (prev === 'en' ? 'ta' : 'en'));
    }, LANG_LOOP_MS);
    return () => clearInterval(interval);
  }, [reduceMotion]);

  return (
    <motion.div className={styles.hero} exit={{ opacity: 0, transition: { duration: 1.1, ease: EASE } }}>
      <div className={styles.grain} aria-hidden="true" />
      <div className={styles.vignette} aria-hidden="true" />
      <div className={styles.ornament} aria-hidden="true" />

      <PetalField count={16} />

      <AnimatePresence>{!introDone && <CarCrashIntro key="crash" />}</AnimatePresence>

      {introDone && (
        <>
      <div className={styles.metadata}>
        <motion.div
          className={styles.date}
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
        >
          11 — 13 NOVEMBER 2026
        </motion.div>
        <motion.div
          className={styles.location}
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 1 }}
        >
          BANGALORE, INDIA
        </motion.div>
      </div>

      <div className={styles.namesStage}>
        <AnimatePresence mode="wait">
          {heroLang === 'en' ? (
            <motion.div
              key="en"
              className={styles.names}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: EASE }}
            >
              <HandwrittenName as="h1" text="Elangovan" lang="en" duration={1.6} delay={0.6} className={styles.name} />
              <motion.span
                className={styles.heart}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.8, duration: 0.5 }}
              >
                ♥
              </motion.span>
              <HandwrittenName as="h1" text="Selvaveena" lang="en" duration={1.6} delay={1.0} className={styles.name} />
            </motion.div>
          ) : (
            <motion.div
              key="ta"
              className={styles.names}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: EASE }}
            >
              <HandwrittenName
                as="h1"
                text="இளங்கோவன்"
                lang="ta"
                duration={1.4}
                className={`${styles.name} ${styles.tamilName}`}
              />
              <motion.span className={styles.heart} initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
                ♥
              </motion.span>
              <HandwrittenName
                as="h1"
                text="செல்வவீணா"
                lang="ta"
                duration={1.4}
                delay={0.2}
                className={`${styles.name} ${styles.tamilName}`}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.p
        className={styles.copy}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.6, duration: 1 }}
      >
        {t.invitation.hero.inviteText}
      </motion.p>

      <motion.button
        type="button"
        className={styles.openButton}
        onClick={handleOpen}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.4, duration: 1 }}
      >
        {t.invitation.hero.openInvitation}
      </motion.button>
        </>
      )}
    </motion.div>
  );
}