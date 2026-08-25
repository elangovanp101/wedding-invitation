import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import styles from './PetalField.module.css';

type Petal = {
  left: number;
  scale: number;
  duration: number;
  delay: number;
  drift: number;
  spin: number;
  colors: [string, string];
};

// Muted, elegant petal hues — ivory/gold as before, plus a touch of jasmine, rose and lavender.
const PETAL_COLORS: [string, string][] = [
  ['#f3e8d7', '#cdbeaa'],
  ['#e8d3a4', '#c9a86b'],
  ['#e3b7bd', '#c98a94'],
  ['#d7c7e8', '#b8a0d0'],
  ['#eee7b8', '#d4c98a'],
];

/** Decorative jasmine petal field. Replace .petal shape with SVG art later. */
export default function PetalField({ count = 12 }: { count?: number }) {
  const [petals, setPetals] = useState<Petal[]>([]);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    setPetals(
      Array.from({ length: count }, () => ({
        left: Math.random() * 100,
        scale: 0.55 + Math.random() * 0.8,
        duration: 13 + Math.random() * 11,
        delay: -Math.random() * 20,
        drift: 20 + Math.random() * 50,
        spin: 180 + Math.random() * 220,
        colors: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
      }))
    );
  }, [count]);

  if (reduceMotion) return null;

  return (
    <div className={styles.petalField} aria-hidden="true">
      {petals.map((p, i) => (
        <motion.span
          key={i}
          className={styles.petal}
          style={{
            left: `${p.left}%`,
            width: 9 * p.scale,
            height: 14 * p.scale,
            background: `linear-gradient(140deg, ${p.colors[0]} 0%, ${p.colors[1]} 100%)`,
            filter: p.scale < 0.85 ? 'blur(1.2px)' : 'none',
          }}
          initial={{ y: '-12vh', x: 0, rotate: 0, opacity: 0 }}
          animate={{
            y: '112vh',
            x: [0, p.drift, -p.drift * 0.6, p.drift * 0.3],
            rotate: [0, p.spin * 0.4, p.spin * 0.75, p.spin],
            opacity: [0, 0.75, 0.65, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
            times: [0, 0.3, 0.7, 1],
          }}
        />
      ))}
    </div>
  );
}