import { motion, useReducedMotion } from 'framer-motion';
import styles from './CarCrashIntro.module.css';

export const CAR_CRASH_DURATION_MS = 2300;
const IMPACT_T = 1.1;
const HEART_IN_T = 1.15;

function CarSilhouette({ flipped }: { flipped?: boolean }) {
  return (
    <svg
      viewBox="0 0 120 50"
      className={styles.carSvg}
      style={{ transform: flipped ? 'scaleX(-1)' : undefined }}
      aria-hidden="true"
    >
      <path
        d="M6,38 L18,38 L26,22 L70,22 L84,38 L114,38 L114,44 L6,44 Z"
        fill="rgba(205,168,107,0.85)"
      />
      <circle cx="28" cy="44" r="7" fill="#0e0b09" stroke="rgba(205,168,107,0.9)" strokeWidth="2" />
      <circle cx="92" cy="44" r="7" fill="#0e0b09" stroke="rgba(205,168,107,0.9)" strokeWidth="2" />
    </svg>
  );
}

/** Two cars race in and collide; a heart pops out as the "byproduct" — then the names begin. */
export default function CarCrashIntro() {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return null;

  return (
    <motion.div
      className={styles.stage}
      animate={{ x: [0, -6, 6, -4, 4, 0] }}
      transition={{ duration: 0.4, delay: IMPACT_T }}
      aria-hidden="true"
    >
      <motion.div
        className={`${styles.car} ${styles.carLeft}`}
        initial={{ x: '-70vw', opacity: 0.9 }}
        animate={{ x: '-6vw' }}
        transition={{ duration: IMPACT_T, ease: [0.6, 0, 0.85, 0] }}
      >
        <CarSilhouette />
      </motion.div>

      <motion.div
        className={`${styles.car} ${styles.carRight}`}
        initial={{ x: '70vw', opacity: 0.9 }}
        animate={{ x: '6vw' }}
        transition={{ duration: IMPACT_T, ease: [0.6, 0, 0.85, 0] }}
      >
        <CarSilhouette flipped />
      </motion.div>

      <motion.div
        className={styles.flash}
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: [0, 1, 0], scale: 1.6 }}
        transition={{ duration: 0.35, delay: IMPACT_T }}
      />

      <motion.span
        className={styles.heart}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: [0, 1, 1, 0], scale: [0, 1.3, 1, 0.6] }}
        transition={{ duration: 1, delay: HEART_IN_T, times: [0, 0.3, 0.75, 1] }}
      >
        ♥
      </motion.span>
    </motion.div>
  );
}
