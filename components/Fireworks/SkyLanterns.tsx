import { motion, useReducedMotion } from 'framer-motion';
import styles from './SkyLanterns.module.css';

// Deliberately just two — enough to feel magical without cluttering the fireworks show.
const LANTERNS = [
  { x: 28, delay: 1.2, duration: 17 },
  { x: 74, delay: 5, duration: 18 },
];

/** A couple of warm sky lanterns drifting up slowly alongside the grand fireworks show. */
export default function SkyLanterns() {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return null;

  return (
    <div className={styles.layer} aria-hidden="true">
      {LANTERNS.map((l, i) => (
        <motion.div
          key={i}
          className={styles.lantern}
          style={{ left: `${l.x}%` }}
          initial={{ y: '105vh', opacity: 0, x: 0 }}
          animate={{ y: '-60vh', opacity: [0, 0.85, 0.85, 0], x: [0, 14, -10, 6] }}
          transition={{ duration: l.duration, delay: l.delay, ease: 'linear' }}
        >
          <span className={styles.glow} />
          <span className={styles.flame} />
        </motion.div>
      ))}
    </div>
  );
}
