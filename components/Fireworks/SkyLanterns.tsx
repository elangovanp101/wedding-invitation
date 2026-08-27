import { motion, useReducedMotion } from 'framer-motion';
import styles from './SkyLanterns.module.css';

// Deliberately just a few — enough to feel magical without cluttering the fireworks show.
const LANTERNS = [
  { x: 22, delay: 1.2, duration: 15, hue: 'gold' },
  { x: 50, delay: 3.2, duration: 16, hue: 'rose' },
  { x: 78, delay: 5, duration: 15.5, hue: 'ivory' },
];

/** A few warm, brightly-lit sky lanterns drifting all the way up and off-screen. */
export default function SkyLanterns() {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return null;

  return (
    <div className={styles.layer} aria-hidden="true">
      {LANTERNS.map((l, i) => (
        <motion.div
          key={i}
          className={`${styles.lantern} ${styles[`hue-${l.hue}`]}`}
          style={{ left: `${l.x}%` }}
          initial={{ y: '105vh', opacity: 0, x: 0 }}
          animate={{ y: '-130vh', opacity: [0, 1, 1, 0], x: [0, 14, -10, 6] }}
          transition={{ duration: l.duration, delay: l.delay, ease: 'linear' }}
        >
          <span className={styles.glow} />
          <span className={styles.flame} />
        </motion.div>
      ))}
    </div>
  );
}
