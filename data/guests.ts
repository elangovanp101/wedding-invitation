// Maps a URL slug (e.g. /invite/priya) to the greeting shown in that guest's personalized link.
// Add one entry per guest/family you want to send a named link to — slugs are case-insensitive
// and should be URL-safe (lowercase, hyphens instead of spaces).
export const guests: Record<string, string> = {
  priya: 'Priya & Family',
  arjun: 'Arjun',
};
