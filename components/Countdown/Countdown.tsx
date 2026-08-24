import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import styles from './Countdown.module.css';
import { weddingData } from '../../data/wedding';

function getTimeLeft(targetIso: string) {
  const diff = new Date(targetIso).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  const seconds = Math.floor(diff / 1000) % 60;
  const minutes = Math.floor(diff / (1000 * 60)) % 60;
  const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return { days, hours, minutes, seconds, done: false };
}

/** Ticking countdown, shown inline right after the guest reveals the scratch card date. */
export default function Countdown() {
  const target = weddingData.events[0].start;
  // Computed client-side only after mount — Date.now() would otherwise differ between
  // the server-rendered HTML and the client's first render, causing a hydration mismatch.
  const [time, setTime] = useState<ReturnType<typeof getTimeLeft> | null>(null);

  useEffect(() => {
    setTime(getTimeLeft(target));
    const id = setInterval(() => setTime(getTimeLeft(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (!time || time.done) return null;

  return (
    <motion.div
      className={styles.countdown}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Countdown to the wedding"
    >
      <span className={styles.label}>Counting down to our wedding</span>
      <div className={styles.units}>
        <div className={styles.unit}>
          <span className={styles.value}>{time.days}</span>
          <span className={styles.unitLabel}>days</span>
        </div>
        <div className={styles.unit}>
          <span className={styles.value}>{String(time.hours).padStart(2, '0')}</span>
          <span className={styles.unitLabel}>hrs</span>
        </div>
        <div className={styles.unit}>
          <span className={styles.value}>{String(time.minutes).padStart(2, '0')}</span>
          <span className={styles.unitLabel}>min</span>
        </div>
        <div className={styles.unit}>
          <span className={styles.value}>{String(time.seconds).padStart(2, '0')}</span>
          <span className={styles.unitLabel}>sec</span>
        </div>
      </div>
    </motion.div>
  );
}
