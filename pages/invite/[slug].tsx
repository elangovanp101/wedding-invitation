import { useRouter } from 'next/router';
import HomePage from '../index';
import { guests } from '../../data/guests';

// Shareable personalized link (e.g. /invite/priya) that greets that guest by name on arrival.
export default function InvitePage() {
  const router = useRouter();
  const slug = typeof router.query.slug === 'string' ? router.query.slug.toLowerCase() : undefined;
  const guestName = slug ? guests[slug] : undefined;
  return <HomePage guestName={guestName} />;
}
