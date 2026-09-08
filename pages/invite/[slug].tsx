import { useRouter } from 'next/router';
import HomePage from '../index';
import { guests } from '../../data/guests';

// Turns a URL slug into a readable name, e.g. "priya-family" -> "Priya Family",
// so any /invite/... link works without needing to register the guest first.
function humanize(slug: string): string {
  return slug
    .split(/[-_]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Shareable personalized link (e.g. /invite/priya) that greets that guest by name on arrival.
// Checks data/guests.ts first for a custom greeting (e.g. "Priya & Family"), otherwise derives
// the name directly from the slug so every link works out of the box.
export default function InvitePage() {
  const router = useRouter();
  const rawSlug = typeof router.query.slug === 'string' ? router.query.slug : undefined;
  const guestName = rawSlug ? guests[rawSlug.toLowerCase()] ?? humanize(rawSlug) : undefined;
  return <HomePage guestName={guestName} />;
}
