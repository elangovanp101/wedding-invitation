import styles from './FairyLights.module.css';

const BULB_TS = [0.1, 0.24, 0.38, 0.52, 0.66, 0.8, 0.94];

// Quadratic bezier from a shared top-center point curving down to each side —
// like a garland of warm lights welcoming guests from both edges of the screen.
const START = { x: 50, y: 2 };
const LEFT_CONTROL = { x: 22, y: 2 };
const LEFT_END = { x: 3, y: 34 };
const RIGHT_CONTROL = { x: 78, y: 2 };
const RIGHT_END = { x: 97, y: 34 };

function quadPoint(t: number, p0: { x: number; y: number }, c: { x: number; y: number }, p1: { x: number; y: number }) {
  const x = (1 - t) ** 2 * p0.x + 2 * (1 - t) * t * c.x + t ** 2 * p1.x;
  const y = (1 - t) ** 2 * p0.y + 2 * (1 - t) * t * c.y + t ** 2 * p1.y;
  return { x, y };
}

/** Persistent curved fairy-light garland framing the top corners of the page, for a festive
 * welcoming feel — separate from the vertical Thoranam leaf strands. */
export default function FairyLights() {
  const leftBulbs = BULB_TS.map((t) => quadPoint(t, START, LEFT_CONTROL, LEFT_END));
  const rightBulbs = BULB_TS.map((t) => quadPoint(t, START, RIGHT_CONTROL, RIGHT_END));

  return (
    <svg className={styles.lights} viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
      <path
        d={`M${START.x},${START.y} Q${LEFT_CONTROL.x},${LEFT_CONTROL.y} ${LEFT_END.x},${LEFT_END.y}`}
        className={styles.wire}
      />
      <path
        d={`M${START.x},${START.y} Q${RIGHT_CONTROL.x},${RIGHT_CONTROL.y} ${RIGHT_END.x},${RIGHT_END.y}`}
        className={styles.wire}
      />
      {[...leftBulbs, ...rightBulbs].map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r="0.9"
          className={styles.bulb}
          style={{ animationDelay: `${(i % 7) * 0.3}s` }}
        />
      ))}
    </svg>
  );
}
