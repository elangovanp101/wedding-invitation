import { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import styles from './Fireworks.module.css';
import SkyLanterns from './SkyLanterns';

const COLORS = ['#e5c88e', '#f3e8d7', '#cda86b', '#8f2a3a', '#e8e0b0', '#7c93b8', '#b9515f', '#e8b55a'];
const SHOW_LIFETIME_MS = 11000;
const GRAND_LIFETIME_MS = 16000;
const VOLLEY_INTERVAL_MS = 1500;

type Spark = { angle: number; distance: number; color: string; size: number };
type Burst = { id: number; x: number; y: number; delay: number; scale: number; sparks: Spark[] };

function makeBurst(id: number, x: number, y: number, delay: number, scale = 1): Burst {
  const count = 22 + Math.floor(Math.random() * 12);
  const sparks = Array.from({ length: count }, (_, i) => ({
    angle: (360 / count) * i + (Math.random() * 12 - 6),
    distance: (70 + Math.random() * 85) * scale,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    size: (3 + Math.random() * 3) * scale,
  }));
  return { id, x, y, delay, scale, sparks };
}

// Always launches from the left/right thirds of the sky — never dead-center — so bursts
// frame the content instead of covering it.
function launchVolley(round: number, grand: boolean): Burst[] {
  if (!grand) {
    return [
      makeBurst(0, 12, 28, 0, 0.9),
      makeBurst(1, 86, 20, 0.3, 0.85),
      makeBurst(2, 22, 45, 0.65, 0.7),
      makeBurst(3, 78, 48, 0.95, 0.95),
      makeBurst(4, 8, 18, 1.35, 0.65),
      makeBurst(5, 92, 40, 1.7, 0.8),
    ];
  }
  const sides = [
    () => 6 + Math.random() * 24, // left third
    () => 70 + Math.random() * 24, // right third
  ];
  return Array.from({ length: 3 }, (_, i) => {
    const x = sides[(round + i) % 2]();
    const y = 12 + Math.random() * 45;
    return makeBurst(round * 10 + i, x, y, i * 0.3, 0.9 + Math.random() * 0.4);
  });
}

/** Celebratory sky fireworks — used at "Open Invitation" and, in `grand` mode, when the
 * wedding date is revealed (repeated volleys over a longer show instead of a single pop). */
export default function Fireworks({ onDone, grand = false }: { onDone: () => void; grand?: boolean }) {
  const reduceMotion = useReducedMotion();
  const [round, setRound] = useState(0);
  const totalLifetime = grand ? GRAND_LIFETIME_MS : SHOW_LIFETIME_MS;

  const bursts = useMemo(() => launchVolley(round, grand), [round, grand]);

  // Keep launching fresh volleys at new positions for the whole show — not just once.
  useEffect(() => {
    const interval = setInterval(() => setRound((r) => r + 1), VOLLEY_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(onDone, totalLifetime);
    return () => clearTimeout(timer);
  }, [onDone, totalLifetime]);

  if (reduceMotion) return null;

  // The whole show fades gently in and out instead of popping in/out abruptly.
  const lifetimeSeconds = totalLifetime / 1000;
  const dissolveIn = 1.4;
  const dissolveOut = 2.2;

  return (
    <motion.div
      className={styles.sky}
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1, 0] }}
      transition={{
        duration: lifetimeSeconds,
        times: [0, dissolveIn / lifetimeSeconds, 1 - dissolveOut / lifetimeSeconds, 1],
        ease: 'easeInOut',
      }}
    >
      {/* Just a couple, kept sparing so it doesn't clutter either show. */}
      <SkyLanterns />
      <div key={round}>
        {bursts.map((burst) => (
          <span key={burst.id} className={styles.origin} style={{ left: `${burst.x}%`, top: `${burst.y}%` }}>
            <motion.span
              className={styles.flash}
              style={{ width: 60 * burst.scale, height: 60 * burst.scale, marginLeft: -30 * burst.scale, marginTop: -30 * burst.scale }}
              initial={{ opacity: 0, scale: 0.2 }}
              animate={{ opacity: [0, 1, 0], scale: 1.6 }}
              transition={{ duration: 0.5, delay: burst.delay, ease: 'easeOut' }}
            />
            {burst.sparks.map((spark, i) => {
              const rad = (spark.angle * Math.PI) / 180;
              const x = Math.cos(rad) * spark.distance;
              const y = Math.sin(rad) * spark.distance;
              return (
                <motion.span
                  key={i}
                  className={styles.spark}
                  style={{ width: spark.size, height: spark.size, background: spark.color }}
                  initial={{ x: 0, y: 0, opacity: 0, scale: 0.6 }}
                  animate={{ x, y: [y * 0.4, y], opacity: [0, 1, 1, 0], scale: [0.6, 1, 0.6] }}
                  transition={{ duration: 1.1, delay: burst.delay, ease: 'easeOut' }}
                />
              );
            })}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

