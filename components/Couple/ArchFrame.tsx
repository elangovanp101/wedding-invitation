type ArchFrameProps = { accent: string; className?: string };

// A simple, elegant pointed palace arch — no lattice fill, just a clean double outline.
const OUTER_PATH = 'M20,250 L20,150 Q20,60 100,30 Q180,60 180,150 L180,250';
const INNER_PATH = 'M28,250 L28,148 Q28,66 100,40 Q172,66 172,148 L172,250';

/** Decorative palace-arch niche frame, standing in for a portrait until real photography arrives. */
export default function ArchFrame({ accent, className }: ArchFrameProps) {
  return (
    <svg viewBox="0 0 200 260" className={className} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
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
