import { useId } from 'react';
import { motion } from 'framer-motion';

type ArchFrameProps = { accent: string; className?: string; decor?: 'code' | 'ecg' };

// A simple, elegant pointed palace arch — no lattice fill, just a clean double outline.
const OUTER_PATH = 'M20,250 L20,150 Q20,60 100,30 Q180,60 180,150 L180,250';
const INNER_PATH = 'M28,250 L28,148 Q28,66 100,40 Q172,66 172,148 L172,250';

// Fixed (not random) so server/client markup always matches — no hydration mismatch. Confined
// to y:150→246 (the arch's lower, straight-sided half) so it never falls behind the name label,
// which sits over the arch's vertical middle.
const BINARY_DIGITS = [
  { x: 45, char: '1', delay: 0, duration: 6, size: 11 },
  { x: 70, char: '0', delay: 1.2, duration: 6.6, size: 9 },
  { x: 95, char: '1', delay: 2.4, duration: 5.8, size: 10 },
  { x: 120, char: '0', delay: 0.6, duration: 6.4, size: 8 },
  { x: 145, char: '1', delay: 3.2, duration: 6.2, size: 9 },
  { x: 60, char: '0', delay: 4, duration: 6.8, size: 10 },
  { x: 130, char: '1', delay: 1.8, duration: 6, size: 8 },
];

const ECG_PATH = 'M28,175 L52,175 L62,148 L76,198 L88,160 L98,175 L172,175';

// A small neural-network graph sitting behind the falling binary digits, in the same lower band
// (y:150→246) — nodes and connections flash softly and out of sync with each other, like data
// quietly moving underneath.
const NODES = [
  { id: 'a', x: 70, y: 163, delay: 0 },
  { id: 'b', x: 130, y: 160, delay: 0.6 },
  { id: 'c', x: 100, y: 188, delay: 1.2 },
  { id: 'd', x: 55, y: 204, delay: 1.8 },
  { id: 'e', x: 145, y: 206, delay: 2.4 },
  { id: 'f', x: 100, y: 224, delay: 3 },
  { id: 'g', x: 76, y: 234, delay: 3.6 },
  { id: 'h', x: 124, y: 232, delay: 4.2 },
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

/** Decorative palace-arch niche frame, standing in for a portrait until real photography arrives.
 * `decor` adds a themed animation clipped inside the arch: falling binary for the groom
 * (confined below the name), a live ECG trace for the bride. */
export default function ArchFrame({ accent, className, decor }: ArchFrameProps) {
  const uid = useId();

  return (
    <svg viewBox="0 0 200 260" className={className} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <defs>
        <clipPath id={`arch-clip-${uid}`}>
          <path d={`${OUTER_PATH} Z`} />
        </clipPath>
      </defs>

      {decor === 'code' && (
        <g clipPath={`url(#arch-clip-${uid})`}>
          <DataNodeMotif accent="#6fd6c4" />
          {BINARY_DIGITS.map((d, i) => (
            <motion.text
              key={i}
              x={d.x}
              fontSize={d.size}
              fontFamily="monospace"
              fill="rgba(111,214,196,0.85)"
              initial={{ y: 150, opacity: 0 }}
              animate={{ y: 246, opacity: [0, 1, 1, 0] }}
              transition={{ duration: d.duration, delay: d.delay, repeat: Infinity, ease: 'linear' }}
            >
              {d.char}
            </motion.text>
          ))}
        </g>
      )}

      {decor === 'ecg' && (
        <g clipPath={`url(#arch-clip-${uid})`}>
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

      <path d={OUTER_PATH} fill="none" stroke="rgba(205,168,107,0.55)" strokeWidth="2" strokeLinejoin="round" />
      <path d={INNER_PATH} fill="none" stroke="rgba(205,168,107,0.25)" strokeWidth="1" strokeLinejoin="round" />

      {/* Finial atop the apex */}
      <line x1="100" y1="30" x2="100" y2="17" stroke="rgba(205,168,107,0.55)" strokeWidth="2" />
      <path d="M100,9 L106,17 L100,25 L94,17 Z" fill="rgba(205,168,107,0.6)" />

      {/* Profession-accent tracing the curve, echoing the car stripe from the intro */}
      <path d="M100,30 Q150,58 180,150" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" opacity="0.45" />
    </svg>
  );
}
