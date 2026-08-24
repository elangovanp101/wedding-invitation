import { useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './FlowerBurst.module.css';

const PETAL_COLORS = ['#f4ead9', '#cda86b', '#e8d3a4', '#8f2a3a', '#e8e0b0'];
const BURST_LIFETIME_MS = 3000;

type Petal = { id: number; angle: number; distance: number; size: number; color: string; delay: number; duration: number };

function makePetals(count: number): Petal[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    angle: (360 / count) * i + (Math.random() * 20 - 10),
    distance: 220 + Math.random() * 220,
    size: 16 + Math.random() * 20,
    color: PETAL_COLORS[i % PETAL_COLORS.length],
    delay: Math.random() * 0.2,
    duration: 1.8 + Math.random() * 0.8,
  }));
}

/** A big radial flower-petal burst, triggered once when the guest opens the invitation. */
export default function FlowerBurst({ onDone }: { onDone: () => void }) {
  const petals = makePetals(56);

  useEffect(() => {
    const timer = setTimeout(onDone, BURST_LIFETIME_MS);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className={styles.layer} aria-hidden="true">
      {petals.map((p) => {
        const rad = (p.angle * Math.PI) / 180;
        const x = Math.cos(rad) * p.distance;
        const y = Math.sin(rad) * p.distance;
        return (
          <motion.span
            key={p.id}
            className={styles.petal}
            style={{ width: p.size, height: p.size * 1.5, background: p.color }}
            initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0.4 }}
            animate={{ x, y, opacity: 0, rotate: p.angle * 2, scale: 1 }}
            transition={{ duration: p.duration, delay: p.delay, ease: 'easeOut' }}
          />
        );
      })}
    </div>
  );
}
