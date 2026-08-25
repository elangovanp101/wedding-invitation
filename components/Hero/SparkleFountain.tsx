import { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import styles from './SparkleFountain.module.css';

type Spark = { x: number; drift: number; delay: number; duration: number; repeatDelay: number; size: number };

function makeSparks(count: number): Spark[] {
  return Array.from({ length: count }, () => ({
    x: (Math.random() - 0.5) * 40,
    drift: (Math.random() - 0.5) * 54,
    delay: Math.random() * 1.6,
    duration: 1.1 + Math.random() * 0.7,
    repeatDelay: Math.random() * 0.4,
    size: 2.6 + Math.random() * 3,
  }));
}

/** Continuous "cold fire" sparkler fountain — like an Indian flower-pot firework (anaar) —
 * flanking the couple's names until the guest clicks "Open Invitation". */
export default function SparkleFountain({ side }: { side: 'left' | 'right' }) {
  const reduceMotion = useReducedMotion();
  const sparks = useMemo(() => makeSparks(20), []);

  if (reduceMotion) return null;

  return (
    <div className={`${styles.fountain} ${side === 'left' ? styles.left : styles.right}`} aria-hidden="true">
      <span className={styles.pot} />
      {sparks.map((s, i) => (
        <motion.span
          key={i}
          className={styles.spark}
          style={{ width: s.size, height: s.size }}
          initial={{ x: 0, y: 0, opacity: 0 }}
          animate={{ x: [0, s.x, s.drift], y: [0, -85, -145], opacity: [0, 1, 0] }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            repeatDelay: s.repeatDelay,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}
