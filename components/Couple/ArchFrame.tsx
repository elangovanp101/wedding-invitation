import { useId } from 'react';
import { motion } from 'framer-motion';

type ArchFrameProps = { accent: string; className?: string; decor?: 'snow' | 'ecg' };

// A simple, elegant pointed palace arch — no lattice fill, just a clean double outline.
const OUTER_PATH = 'M20,250 L20,150 Q20,60 100,30 Q180,60 180,150 L180,250';
const INNER_PATH = 'M28,250 L28,148 Q28,66 100,40 Q172,66 172,148 L172,250';

// Fixed (not random) so server/client markup always matches — no hydration mismatch.
const SNOWFLAKES = [
  { x: 55, delay: 0, duration: 7, size: 11, drift: 6, spin: 40 },
  { x: 100, delay: 1.4, duration: 8, size: 8, drift: -8, spin: -30 },
  { x: 140, delay: 2.6, duration: 6.6, size: 9, drift: 5, spin: 50 },
  { x: 75, delay: 3.8, duration: 7.8, size: 7, drift: -4, spin: -45 },
  { x: 122, delay: 0.7, duration: 8.6, size: 10, drift: 7, spin: 35 },
  { x: 90, delay: 4.6, duration: 7.2, size: 6, drift: -6, spin: -25 },
];

const ECG_PATH = 'M28,175 L52,175 L62,148 L76,198 L88,160 L98,175 L172,175';

/** Real animated gear illustration (public/images/gear.gif), shown at roughly the same
 * placement inside the arch as the ECG trace for the bride's side. */
function GearMotif() {
  return <image href="/images/gear.gif" x={54} y={144} width={92} height={92} preserveAspectRatio="xMidYMid meet" />;
}

/** Decorative palace-arch niche frame, standing in for a portrait until real photography arrives.
 * `decor` adds a themed animation clipped inside the arch: falling snow + turning gears for the
 * groom, a live ECG trace for the bride. */
export default function ArchFrame({ accent, className, decor }: ArchFrameProps) {
  const uid = useId();

  return (
    <svg viewBox="0 0 200 260" className={className} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <defs>
        <clipPath id={`arch-clip-${uid}`}>
          <path d={`${OUTER_PATH} Z`} />
        </clipPath>
      </defs>

      {decor === 'snow' && (
        <g clipPath={`url(#arch-clip-${uid})`}>
          <GearMotif />
          {SNOWFLAKES.map((s, i) => (
            <motion.text
              key={i}
              x={s.x}
              fontSize={s.size}
              fill="rgba(244,234,217,0.9)"
              initial={{ y: 38, opacity: 0, rotate: 0 }}
              animate={{ y: 246, opacity: [0, 1, 1, 0], x: [s.x, s.x + s.drift, s.x], rotate: s.spin }}
              transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: 'linear' }}
            >
              ❄
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
