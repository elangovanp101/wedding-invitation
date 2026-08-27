import { motion } from 'framer-motion';
import styles from './RunningFigures.module.css';

function Runner({ flipped }: { flipped?: boolean }) {
  return (
    <svg
      viewBox="0 0 40 60"
      className={styles.runner}
      style={{ transform: flipped ? 'scaleX(-1)' : undefined }}
      aria-hidden="true"
    >
      <circle cx="20" cy="8" r="5" fill="none" stroke="currentColor" strokeWidth="2" />
      <path
        d="M20,13 L17,32 M17,17 L8,10 M17,20 L28,28 M17,32 L6,45 M17,32 L26,40 L22,55"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Two figures running toward each other, meeting at the center — a quiet, elegant motif
 * above "With love & blessings". */
export default function RunningFigures() {
  return (
    <div className={styles.stage} aria-hidden="true">
      <motion.div
        className={styles.figure}
        initial={{ x: '-60%', opacity: 0 }}
        whileInView={{ x: '0%', opacity: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <Runner />
      </motion.div>

      <motion.span
        className={styles.spark}
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        ✦
      </motion.span>

      <motion.div
        className={styles.figure}
        initial={{ x: '60%', opacity: 0 }}
        whileInView={{ x: '0%', opacity: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <Runner flipped />
      </motion.div>
    </div>
  );
}
