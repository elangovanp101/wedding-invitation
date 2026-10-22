import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import styles from './BalloonShower.module.css';

export const BALLOON_COLORS = ['#e63950', '#f2a93b', '#f4d35e', '#4fb286', '#4a90d9', '#9b6fd1', '#f06fa0'];
const COUNT = 30;
const LIFETIME_MS = 9500;

type Balloon = { id: number; left: number; delay: number; duration: number; drift: number; color: string; size: number };

function makeBalloons(): Balloon[] {
  return Array.from({ length: COUNT }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 1.6,
    duration: 6 + Math.random() * 2.5,
    drift: (Math.random() - 0.5) * 60,
    color: BALLOON_COLORS[i % BALLOON_COLORS.length],
    size: 22 + Math.random() * 16,
  }));
}

/** Heart-shaped balloons rising bottom-to-top, same look used for the Wishes "🎉" reaction —
 * shared here so it can also celebrate the guest reaching the end of the page. If `onDone` is
 * given, this unmounts itself after its float finishes; otherwise the caller controls its
 * lifetime (e.g. Wishes already manages that via its own burst-cleanup timer). */
export default function BalloonShower({ onDone }: { onDone?: () => void }) {
  const balloons = useRef<Balloon[]>(makeBalloons()).current;

  useEffect(() => {
    if (!onDone) return;
    const timer = setTimeout(onDone, LIFETIME_MS);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className={styles.shower} aria-hidden="true">
      {balloons.map((p) => (
        <motion.svg
          key={p.id}
          viewBox="0 0 24 34"
          className={styles.balloon}
          style={{ left: `${p.left}%`, top: 0, width: p.size, height: p.size * 1.4 }}
          initial={{ y: '110vh', opacity: 0, x: 0 }}
          animate={{ y: '-20vh', opacity: [0, 1, 1, 0], x: [0, p.drift], rotate: [-6, 6, -6] }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: 'easeOut',
            rotate: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' },
          }}
        >
          <line x1="12" y1="20" x2="12" y2="33" stroke="rgba(255,255,255,0.45)" strokeWidth="0.6" />
          <path
            d="M12,20 C12,20 2,13 2,6.8 C2,3 4.8,1 7.6,1 C9.6,1 11.2,2.2 12,4 C12.8,2.2 14.4,1 16.4,1 C19.2,1 22,3 22,6.8 C22,13 12,20 12,20 Z"
            fill={p.color}
          />
          <ellipse cx="7.5" cy="6" rx="2" ry="1.1" fill="rgba(255,255,255,0.5)" />
        </motion.svg>
      ))}
    </div>
  );
}
