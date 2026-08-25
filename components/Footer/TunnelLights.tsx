const LAYERS = [
  { amplitude: 46, opacity: 0.18, count: 9 },
  { amplitude: 35, opacity: 0.3, count: 8 },
  { amplitude: 25, opacity: 0.45, count: 7 },
  { amplitude: 16, opacity: 0.65, count: 6 },
];
const BASE_Y = 56;

function archPoint(t: number, amplitude: number) {
  const x = 6 + t * 88;
  const y = BASE_Y - Math.sin(t * Math.PI) * amplitude;
  return { x, y };
}

/** Nested arches of warm fairy lights receding toward the centre — the "tunnel of lights"
 * often used at event entrances — framing the final closing message. */
export default function TunnelLights({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 60" className={className} preserveAspectRatio="none" aria-hidden="true">
      {LAYERS.map((layer, li) => {
        const path = `M6,${BASE_Y} Q50,${BASE_Y - layer.amplitude * 2} 94,${BASE_Y}`;
        const bulbs = Array.from({ length: layer.count }, (_, i) => archPoint(i / (layer.count - 1), layer.amplitude));
        return (
          <g key={li} opacity={layer.opacity}>
            <path d={path} fill="none" stroke="rgba(205,168,107,0.5)" strokeWidth="0.3" vectorEffect="non-scaling-stroke" />
            {bulbs.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r="0.9"
                fill="#e5c88e"
                style={{
                  animation: 'tunnelTwinkle 2.6s ease-in-out infinite',
                  animationDelay: `${((li * 7 + i) % 9) * 0.25}s`,
                }}
              />
            ))}
          </g>
        );
      })}
      <style>{`
        @keyframes tunnelTwinkle { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
        @media (prefers-reduced-motion: reduce) {
          circle { animation: none !important; opacity: 0.8 !important; }
        }
      `}</style>
    </svg>
  );
}
