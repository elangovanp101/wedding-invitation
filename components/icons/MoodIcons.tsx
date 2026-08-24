type IconProps = { className?: string };

const shared = {
  viewBox: '0 0 24 24',
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 1.2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true as const,
};

export function ChurchIcon({ className }: IconProps) {
  return (
    <svg {...shared} className={className}>
      <line x1="12" y1="2" x2="12" y2="22" />
      <line x1="5" y1="9" x2="19" y2="9" />
    </svg>
  );
}

export function ReceptionIcon({ className }: IconProps) {
  return (
    <svg {...shared} className={className}>
      <line x1="12" y1="2" x2="12" y2="8" />
      <line x1="12" y1="8" x2="4" y2="16" />
      <line x1="12" y1="8" x2="12" y2="18" />
      <line x1="12" y1="8" x2="20" y2="16" />
      <circle cx="4" cy="17" r="1.4" />
      <circle cx="12" cy="19" r="1.4" />
      <circle cx="20" cy="17" r="1.4" />
    </svg>
  );
}

/** Kolam-inspired dot lattice for the muhurtham / traditional ceremony. */
export function TraditionalIcon({ className }: IconProps) {
  return (
    <svg {...shared} className={className}>
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="12" cy="4" r="1.2" />
      <circle cx="12" cy="20" r="1.2" />
      <circle cx="4" cy="12" r="1.2" />
      <circle cx="20" cy="12" r="1.2" />
      <circle cx="6.5" cy="6.5" r="1" />
      <circle cx="17.5" cy="6.5" r="1" />
      <circle cx="6.5" cy="17.5" r="1" />
      <circle cx="17.5" cy="17.5" r="1" />
    </svg>
  );
}
