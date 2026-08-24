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
};

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