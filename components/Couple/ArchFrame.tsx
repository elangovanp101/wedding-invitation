import { useId } from 'react';
import { motion } from 'framer-motion';

type ArchFrameProps = { accent: string; className?: string; decor?: 'code' | 'ecg' };

// A heart silhouette, double-outlined — the outer line's color is animated (see the gradient
// in the <defs> below), the inner line stays a quiet, static gold.
const HEART_OUTER_PATH =
  'M100,232 C46,179 10,134 10,90 C10,53 35,30 60,30 C80,30 96,46 100,71 C104,46 120,30 140,30 C165,30 190,53 190,90 C190,134 154,179 100,232 Z';
const HEART_INNER_PATH =
  'M100,225 C52,175 18,132 18,92 C18,58 40,38 62,38 C80,38 94,52 100,74 C106,52 120,38 138,38 C160,38 182,58 182,92 C182,132 148,175 100,225 Z';

// Fixed (not random) so server/client markup always matches — no hydration mismatch. Confined
// to the heart's lower half (y:140→220) so it never falls behind the name label, which sits
// over the heart's vertical middle.
const BINARY_DIGITS = [
  { x: 50, char: '1', delay: 0, duration: 6, size: 11 },
  { x: 72, char: '0', delay: 1.2, duration: 6.6, size: 9 },
  { x: 95, char: '1', delay: 2.4, duration: 5.8, size: 10 },
  { x: 118, char: '0', delay: 0.6, duration: 6.4, size: 8 },
  { x: 140, char: '1', delay: 3.2, duration: 6.2, size: 9 },
  { x: 62, char: '0', delay: 4, duration: 6.8, size: 10 },
  { x: 128, char: '1', delay: 1.8, duration: 6, size: 8 },
];

const ECG_PATH = 'M45,158 L62,158 L70,140 L80,178 L90,148 L98,158 L155,158';

// A small neural-network graph sitting behind the falling binary digits, in the same lower band
// — nodes and connections flash softly and out of sync with each other, like data quietly
// moving underneath.
const NODES = [
  { id: 'a', x: 70, y: 150, delay: 0 },
  { id: 'b', x: 130, y: 148, delay: 0.6 },
  { id: 'c', x: 100, y: 172, delay: 1.2 },
  { id: 'd', x: 58, y: 188, delay: 1.8 },
  { id: 'e', x: 142, y: 188, delay: 2.4 },
  { id: 'f', x: 100, y: 205, delay: 3 },
  { id: 'g', x: 78, y: 213, delay: 3.6 },
  { id: 'h', x: 122, y: 213, delay: 4.2 },
];
const NODE_MAP = Object.fromEntries(NODES.map((n) => [n.id, n]));
const EDGES: [string, string][] = [
  ['a', 'c'],
  ['b', 'c'],
  ['c', 'f'],
  ['d', 'c'],
  ['e', 'c'],
  ['d', 'g'],
  ['e', 'h'],
  ['f', 'g'],
  ['f', 'h'],
  ['a', 'd'],
  ['b', 'e'],
];

function DataNodeMotif({ accent }: { accent: string }) {
  return (
    <g>
      {EDGES.map(([from, to], i) => {
        const a = NODE_MAP[from];
        const b = NODE_MAP[to];
        return (
          <motion.line
            key={i}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke={accent}
            strokeWidth="1"
            animate={{ opacity: [0.04, 0.16, 0.04] }}
            transition={{ duration: 4 + (i % 3), delay: i * 0.35, repeat: Infinity, ease: 'easeInOut' }}
          />
        );
      })}
      {NODES.map((n) => (
        <motion.circle
          key={n.id}
          cx={n.x}
          cy={n.y}
          r={2.4}
          fill={accent}
          animate={{ opacity: [0.08, 0.4, 0.08] }}
          transition={{ duration: 3.6, delay: n.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </g>
  );
}

/** Decorative heart-shaped niche frame, standing in for a portrait until real photography
 * arrives. `decor` adds a themed animation clipped inside the heart: falling binary for the
 * groom (confined below the name), a live ECG trace for the bride. The outer outline is a
 * static dark red. */
export default function ArchFrame({ accent, className, decor }: ArchFrameProps) {
  const uid = useId();

  return (
    <svg viewBox="0 0 200 260" className={className} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <defs>
        <clipPath id={`heart-clip-${uid}`}>
          <path d={HEART_OUTER_PATH} />
        </clipPath>
      </defs>

      {decor === 'code' && (
        <g clipPath={`url(#heart-clip-${uid})`}>
          <DataNodeMotif accent="#6fd6c4" />
          {BINARY_DIGITS.map((d, i) => (
            <motion.text
              key={i}
              x={d.x}
              fontSize={d.size}
              fontFamily="monospace"
              fill="rgba(111,214,196,0.85)"
              initial={{ y: 140, opacity: 0 }}
              animate={{ y: 220, opacity: [0, 1, 1, 0] }}
              transition={{ duration: d.duration, delay: d.delay, repeat: Infinity, ease: 'linear' }}
            >
              {d.char}
            </motion.text>
          ))}
        </g>
      )}

      {decor === 'ecg' && (
        <g clipPath={`url(#heart-clip-${uid})`}>
          <path d={ECG_PATH} fill="none" stroke="rgba(185,81,95,0.3)" strokeWidth="2" />
          <motion.path
            d={ECG_PATH}
            fill="none"
            stroke="#e5949e"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeDasharray="26 400"
            animate={{ strokeDashoffset: [0, -400] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'linear' }}
          />
        </g>
      )}

      <path d={HEART_OUTER_PATH} fill="none" stroke="#7a1420" strokeWidth="2.5" strokeLinejoin="round" />
      <path d={HEART_INNER_PATH} fill="none" stroke="rgba(205,168,107,0.25)" strokeWidth="1" strokeLinejoin="round" />
    </svg>
  );
}
