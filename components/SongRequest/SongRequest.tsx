import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { doc, onSnapshot, setDoc, increment, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import styles from './SongRequest.module.css';
import { useLanguage } from '../../context/LanguageContext';
import { db } from '../../lib/firebase';

// Curated, not free-text — avoids spelling variants ("A R Rahman" vs "AR Rahman" vs "Rahman")
// splitting what should be one tally into several.
const ARTISTS = [
  { id: 'ar-rahman', name: 'A.R. Rahman' },
  { id: 'anirudh', name: 'Anirudh Ravichander' },
  { id: 'yuvan', name: 'Yuvan Shankar Raja' },
  { id: 'ilaiyaraaja', name: 'Ilaiyaraaja' },
  { id: 'sid-sriram', name: 'Sid Sriram' },
  { id: 'arijit', name: 'Arijit Singh' },
];

const VOTE_KEY = 'songArtistVote';
const SUGGEST_KEY = 'songArtistSuggested';
const SUGGESTION_MAX_LENGTH = 40;

// Fixed (not random) so server/client markup always matches — no hydration mismatch. A row of
// ambient "equalizer" bars bouncing behind the cards, like a stage visualizer.
const EQ_BARS = [
  { delay: 0, duration: 1.1 }, { delay: 0.15, duration: 0.9 }, { delay: 0.3, duration: 1.3 },
  { delay: 0.1, duration: 1.0 }, { delay: 0.4, duration: 0.8 }, { delay: 0.25, duration: 1.2 },
  { delay: 0.05, duration: 1.15 }, { delay: 0.35, duration: 0.95 }, { delay: 0.2, duration: 1.05 },
  { delay: 0.45, duration: 0.85 }, { delay: 0.12, duration: 1.25 }, { delay: 0.28, duration: 1.0 },
];

// A few notes drifting up through the section, like sound rising off a stage.
const NOTES = [
  { glyph: '♪', left: 8, delay: 0, duration: 9 },
  { glyph: '♫', left: 24, delay: 2.4, duration: 10.5 },
  { glyph: '♩', left: 42, delay: 4.8, duration: 8.5 },
  { glyph: '♬', left: 60, delay: 1.6, duration: 11 },
  { glyph: '♪', left: 78, delay: 6, duration: 9.5 },
  { glyph: '♫', left: 92, delay: 3.6, duration: 10 },
];

function EqualizerBackdrop() {
  return (
    <div className={styles.equalizer} aria-hidden="true">
      {EQ_BARS.map((bar, i) => (
        <motion.span
          key={i}
          className={styles.eqBar}
          animate={{ scaleY: [0.15, 1, 0.35, 0.8, 0.15] }}
          transition={{ duration: bar.duration, delay: bar.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

function FloatingNotes() {
  return (
    <div className={styles.notesLayer} aria-hidden="true">
      {NOTES.map((n, i) => (
        <motion.span
          key={i}
          className={styles.note}
          style={{ left: `${n.left}%` }}
          initial={{ y: '10%', opacity: 0 }}
          animate={{ y: '-120%', opacity: [0, 1, 1, 0] }}
          transition={{ duration: n.duration, delay: n.delay, repeat: Infinity, ease: 'linear' }}
        >
          {n.glyph}
        </motion.span>
      ))}
    </div>
  );
}

/** "Which artist's songs do you want to hear more?" — a live, guest-voted poll (curated artists,
 * not free-text, so nothing needs fuzzy-matching). Shows each artist's live share of the vote as
 * a percentage (raw counts still live in Firestore for the couple to check), with a "crowd
 * favorite" badge on whoever's leading, plus a spot to suggest an artist that's missing. */
export default function SongRequest() {
  const { t } = useLanguage();
  const copy = t.invitation.songRequest;
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [myPick, setMyPick] = useState<string | null>(null);
  const [milestone, setMilestone] = useState<{ artist: string; count: number } | null>(null);
  const [suggestion, setSuggestion] = useState('');
  const [suggested, setSuggested] = useState(false);

  useEffect(() => {
    setMyPick(localStorage.getItem(VOTE_KEY));
    setSuggested(!!localStorage.getItem(SUGGEST_KEY));
  }, []);

  useEffect(() => {
    if (!db) return;
    return onSnapshot(doc(db, 'songVotes', 'tally'), (snap) => {
      setVotes((snap.data() as Record<string, number>) ?? {});
    });
  }, []);

  const handleVote = async (artistId: string, artistName: string) => {
    if (myPick) return;
    const nextCount = (votes[artistId] ?? 0) + 1;
    setMyPick(artistId);
    localStorage.setItem(VOTE_KEY, artistId);
    // Optimistic — shows the milestone instantly instead of waiting on a Firestore round trip.
    setVotes((prev) => ({ ...prev, [artistId]: nextCount }));
    setMilestone({ artist: artistName, count: nextCount });
    if (!db) return;
    try {
      await setDoc(doc(db, 'songVotes', 'tally'), { [artistId]: increment(1) }, { merge: true });
    } catch (err) {
      console.error('Failed to record song vote:', err);
    }
  };

  const handleSuggest = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = suggestion.trim();
    if (!name || suggested) return;
    setSuggested(true);
    localStorage.setItem(SUGGEST_KEY, name);
    if (db) {
      try {
        await addDoc(collection(db, 'songSuggestions'), { name, createdAt: serverTimestamp() });
      } catch (err) {
        console.error('Failed to save artist suggestion:', err);
      }
    }
    setSuggestion('');
  };

  const totalVotes = Object.values(votes).reduce((sum, n) => sum + n, 0);
  const maxVotes = Math.max(0, ...Object.values(votes));

  return (
    <section id="song-request" className={styles.section}>
      <EqualizerBackdrop />
      <FloatingNotes />

      <motion.h2
        className={styles.title}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.9 }}
      >
        {copy.title}
      </motion.h2>
      <p className={styles.subtitle}>{copy.subtitle}</p>

      <div className={styles.grid}>
        {ARTISTS.map((artist) => {
          const count = votes[artist.id] ?? 0;
          const pct = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
          const picked = myPick === artist.id;
          const isTop = totalVotes > 0 && count === maxVotes && maxVotes > 0;
          return (
            <button
              key={artist.id}
              type="button"
              className={`${styles.artistCard} ${picked ? styles.artistPicked : ''}`}
              onClick={() => handleVote(artist.id, artist.name)}
              disabled={!!myPick}
            >
              {isTop ? <span className={styles.crown}>🏆</span> : null}
              <span className={styles.artistName}>{artist.name}</span>
              <div className={styles.pctTrack}>
                <motion.div
                  className={styles.pctFill}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </div>
              <span className={styles.pctNumber}>{pct}%</span>
            </button>
          );
        })}
      </div>

      {milestone ? (
        <motion.p
          className={styles.milestone}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {copy.milestonePrefix} <strong>#{milestone.count}</strong> {copy.milestoneMid} <strong>{milestone.artist}</strong> ✦
        </motion.p>
      ) : null}

      <form className={styles.suggestForm} onSubmit={handleSuggest}>
        <p className={styles.suggestLabel}>{copy.suggestLabel}</p>
        {suggested ? (
          <p className={styles.suggestThanks}>{copy.suggestThanks}</p>
        ) : (
          <div className={styles.suggestRow}>
            <input
              type="text"
              value={suggestion}
              onChange={(e) => setSuggestion(e.target.value.slice(0, SUGGESTION_MAX_LENGTH))}
              placeholder={copy.suggestPlaceholder}
              className={styles.suggestInput}
              maxLength={SUGGESTION_MAX_LENGTH}
            />
            <button type="submit" className={styles.suggestButton} disabled={!suggestion.trim()}>
              {copy.suggestSubmit}
            </button>
          </div>
        )}
      </form>
    </section>
  );
}
