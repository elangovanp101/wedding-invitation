import { motion } from 'framer-motion';
import styles from './BackFlash.module.css';

// Fixed (not random) positions/timings so server and client markup always match — a few stamps
// glow at once, staggered so it never feels synchronized or overwhelming.
const STAMPS = [
  { top: '8%', left: '12%', size: 180, delay: 0, duration: 9, rotate: -8 },
  { top: '22%', left: '78%', size: 140, delay: 2.4, duration: 10.5, rotate: 6 },
  { top: '48%', left: '6%', size: 160, delay: 4.8, duration: 8.5, rotate: 4 },
  { top: '64%', left: '85%', size: 200, delay: 1.6, duration: 11, rotate: -5 },
  { top: '80%', left: '20%', size: 150, delay: 6, duration: 9.5, rotate: 9 },
  { top: '35%', left: '45%', size: 170, delay: 3.6, duration: 10, rotate: -3 },
];

/** Traditional rangoli/stamp artwork (public/images/backflash.png) glowing softly here and
 * there across the page — an ambient, slow-fading background flourish, never all at once. */
export default function BackFlash() {
  return (
    <div className={styles.layer} aria-hidden="true">
      {STAMPS.map((s, i) => (
        <motion.img
          key={i}
          src="/images/backflash.png"
          alt=""
          className={styles.stamp}
          style={{ top: s.top, left: s.left, width: s.size, rotate: s.rotate }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.30, 0] }}
          transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}
