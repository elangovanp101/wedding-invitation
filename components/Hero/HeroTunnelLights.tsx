import { motion } from 'framer-motion';
import styles from './HeroTunnelLights.module.css';

// Nested garlands fanning from a top-center point down to the left/right edges — an "A" shape,
// but drawn as smooth hanging curves (like festoon lights strung for a walkway/marquee entrance),
// not straight lines. Each layer droops a little more than the last for a layered, tunnel-like depth.
const APEX = { x: 50, y: 8 };
const LEFT_END = { x: 2, y: 58 };
const RIGHT_END = { x: 98, y: 58 };
const LAYERS = [
  { sag: 6, opacity: 0.3, count: 6 },
  { sag: 14, opacity: 0.45, count: 6 },
  { sag: 22, opacity: 0.6, count: 7 },
  { sag: 30, opacity: 0.8, count: 7 },
  { sag: 38, opacity: 0.95, count: 8 },
];
const LAYER_STAGGER = 0.15;
const LAYER_FADE_DURATION = 0.7;

function garlandPath(end: { x: number; y: number }, sag: number) {
  const midX = (APEX.x + end.x) / 2;
  const midY = (APEX.y + end.y) / 2 + sag;
  return { path: `M${APEX.x},${APEX.y} Q${midX},${midY} ${end.x},${end.y}`, ctrl: { x: midX, y: midY } };
}

function quadPoint(t: number, p0: { x: number; y: number }, c: { x: number; y: number }, p1: { x: number; y: number }) {
  const x = (1 - t) ** 2 * p0.x + 2 * (1 - t) * t * c.x + t ** 2 * p1.x;
  const y = (1 - t) ** 2 * p0.y + 2 * (1 - t) * t * c.y + t ** 2 * p1.y;
  return { x, y };
}

/** A layered garland of warm fairy lights hanging from top-center out to both edges, like the
 * entrance to a lit walkway tunnel. `startDelay` is when the innermost (least droopy) layer begins. */
export default function HeroTunnelLights({ startDelay = 0 }: { startDelay?: number }) {
  return (
    <svg className={styles.tunnel} viewBox="0 0 100 65" preserveAspectRatio="none" aria-hidden="true">
      {LAYERS.map((layer, li) => {
        const left = garlandPath(LEFT_END, layer.sag);
        const right = garlandPath(RIGHT_END, layer.sag);
        const ts = Array.from({ length: layer.count }, (_, i) => (i + 1) / (layer.count + 1));
        const bulbs = [
          ...ts.map((t) => quadPoint(t, APEX, left.ctrl, LEFT_END)),
          ...ts.map((t) => quadPoint(t, APEX, right.ctrl, RIGHT_END)),
        ];
        return (
          <motion.g
            key={li}
            initial={{ opacity: 0 }}
            animate={{ opacity: layer.opacity }}
            transition={{ duration: LAYER_FADE_DURATION, delay: startDelay + li * LAYER_STAGGER, ease: 'easeOut' }}
          >
            <path d={left.path} className={styles.wire} />
            <path d={right.path} className={styles.wire} />
            {bulbs.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r="1"
                className={styles.bulb}
                style={{ animationDelay: `${((li * 8 + i) % 9) * 0.25}s` }}
              />
            ))}
          </motion.g>
        );
      })}
    </svg>
  );
}
