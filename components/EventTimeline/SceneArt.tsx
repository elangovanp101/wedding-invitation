import { motion } from 'framer-motion';

type ArtProps = { className?: string };

/** Soft aisle perspective, gently breathing, converging toward a wedding ring motif. */
export function ChurchArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 400 300" className={className} preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <motion.g
        stroke="rgba(205,168,107,0.35)"
        strokeWidth="1"
        fill="none"
        animate={{ opacity: [0.65, 1, 0.65] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <line x1="0" y1="300" x2="170" y2="40" />
        <line x1="60" y1="300" x2="180" y2="40" />
        <line x1="400" y1="300" x2="230" y2="40" />
        <line x1="340" y1="300" x2="220" y2="40" />
        <path d="M120,120 Q200,40 280,120" />
      </motion.g>
      <motion.g
        stroke="rgba(205,168,107,0.8)"
        strokeWidth="2"
        fill="none"
        initial={{ opacity: 0, rotate: -8 }}
        whileInView={{ opacity: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.6, ease: 'easeOut' }}
        style={{ transformOrigin: '202px 150px' }}
      >
        <circle cx="190" cy="150" r="22" />
        <circle cx="214" cy="150" r="22" />
      </motion.g>
    </svg>
  );
}

/** Bangalore Palace-inspired skyline with a slow glow and twinkling chandelier lights. */
export function ReceptionArt({ className }: ArtProps) {
  const towers = [
    { x: 20, w: 30, h: 90 }, { x: 55, w: 40, h: 140 }, { x: 100, w: 26, h: 80 },
    { x: 135, w: 50, h: 170 }, { x: 195, w: 30, h: 110 }, { x: 235, w: 50, h: 170 },
    { x: 295, w: 26, h: 80 }, { x: 330, w: 40, h: 140 }, { x: 375, w: 25, h: 90 },
  ];
  return (
    <svg viewBox="0 0 400 220" className={className} preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <motion.g
        fill="rgba(205,168,107,0.16)"
        animate={{ opacity: [0.75, 1, 0.75] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      >
        {towers.map((t) => (
          <rect key={t.x} x={t.x} y={220 - t.h} width={t.w} height={t.h} />
        ))}
        {towers
          .filter((_, i) => i % 2 === 1)
          .map((t) => (
            <circle key={t.x} cx={t.x + t.w / 2} cy={220 - t.h} r={t.w / 2} />
          ))}
      </motion.g>
      {[60, 140, 220, 300, 360].map((x, i) => (
        <motion.circle
          key={x}
          cx={x}
          cy={30 + (i % 2) * 18}
          r="2.2"
          fill="rgba(232,211,164,0.9)"
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 2.4 + i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </svg>
  );
}

const GARLAND_START = { x: 57, y: 55 };
const GARLAND_CONTROL = { x: 200, y: 95 };
const GARLAND_END = { x: 343, y: 55 };
const GARLAND_TS = [0.12, 0.24, 0.36, 0.48, 0.6, 0.72, 0.84];

function quadPoint(t: number) {
  const x = (1 - t) ** 2 * GARLAND_START.x + 2 * (1 - t) * t * GARLAND_CONTROL.x + t ** 2 * GARLAND_END.x;
  const y = (1 - t) ** 2 * GARLAND_START.y + 2 * (1 - t) * t * GARLAND_CONTROL.y + t ** 2 * GARLAND_END.y;
  return { x, y };
}

/** A small kalyana mandapam: two pillars with kalasam finials joined by a toranam
 * garland, marigold-and-jasmine flower clusters swaying gently along its length. */
export function TraditionalArt({ className }: ArtProps) {
  const distantTiers = [
    { y: 210, w: 160 }, { y: 180, w: 132 }, { y: 152, w: 106 },
    { y: 126, w: 82 }, { y: 102, w: 58 }, { y: 80, w: 34 },
  ];

  return (
    <svg viewBox="0 0 400 220" className={className} preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      {/* distant gopuram silhouette, kept faint so the mandapam reads as the foreground */}
      <motion.g
        fill="rgba(205,168,107,0.08)"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      >
        {distantTiers.map((t) => (
          <rect key={t.y} x={200 - (t.w * 0.65) / 2} y={t.y - 30} width={t.w * 0.65} height="16" rx="2" />
        ))}
      </motion.g>

      {/* mandapam pillars with kalasam finials */}
      <g fill="rgba(205,168,107,0.3)">
        <rect x="50" y="55" width="14" height="165" />
        <rect x="336" y="55" width="14" height="165" />
        <path d="M48,55 L66,55 L60,40 L54,40 Z" />
        <path d="M334,55 L352,55 L346,40 L340,40 Z" />
        <circle cx="57" cy="36" r="6" />
        <circle cx="343" cy="36" r="6" />
      </g>

      {/* toranam garland strung between the pillars */}
      <path
        d={`M${GARLAND_START.x},${GARLAND_START.y} Q${GARLAND_CONTROL.x},${GARLAND_CONTROL.y} ${GARLAND_END.x},${GARLAND_END.y}`}
        stroke="rgba(205,168,107,0.45)"
        strokeWidth="1.5"
        fill="none"
      />

      {GARLAND_TS.map((t, i) => {
        const p = quadPoint(t);
        const drop = 12 + (i % 3) * 5;
        return (
          <motion.g
            key={t}
            style={{ transformOrigin: `${p.x}px ${p.y}px` }}
            animate={{ rotate: [-4, 4, -4] }}
            transition={{ duration: 3.6 + (i % 3) * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.25 }}
          >
            <line x1={p.x} y1={p.y} x2={p.x} y2={p.y + drop} stroke="rgba(205,168,107,0.4)" strokeWidth="1" />
            <circle cx={p.x} cy={p.y + drop + 4} r="4" fill={i % 2 === 0 ? 'rgba(232,181,90,0.85)' : 'rgba(244,234,217,0.85)'} />
            <circle cx={p.x - 4} cy={p.y + drop + 2} r="2.6" fill="rgba(232,181,90,0.7)" />
            <circle cx={p.x + 4} cy={p.y + drop + 2} r="2.6" fill="rgba(244,234,217,0.7)" />
          </motion.g>
        );
      })}
    </svg>
  );
}
