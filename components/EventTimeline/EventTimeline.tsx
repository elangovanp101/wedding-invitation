import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './EventTimeline.module.css';
import { useLanguage } from '../../context/LanguageContext';
import { ChurchIcon, ReceptionIcon, TraditionalIcon } from '../icons/MoodIcons';
import { ChurchArt, ReceptionArt, TraditionalArt } from './SceneArt';

const moodIcon: Record<string, typeof ChurchIcon> = {
  church: ChurchIcon,
  reception: ReceptionIcon,
  traditional: TraditionalIcon,
};

const moodArt: Record<string, typeof ChurchArt> = {
  church: ChurchArt,
  reception: ReceptionArt,
  traditional: TraditionalArt,
};

// PLACEHOLDER: illustrated line-art for now — swap in real venue photography/video per celebration.
const moodImage: Record<string, string> = {
  church: '/images/elanveena.jpeg',
  reception: '/images/elanveena.jpeg',
  traditional: '/images/elanveena.jpeg',
};

export default function EventTimeline() {
  const { t } = useLanguage();
  const copy = t.invitation.events;
  const [peeked, setPeeked] = useState<Record<string, boolean>>({});

  const entries = [
    { mood: 'church', ...copy.churchWedding },
    { mood: 'reception', ...copy.reception },
    { mood: 'traditional', ...copy.traditionalWedding },
  ];

  return (
    <section id="celebrations" className={styles.section}>
      <h2 className={styles.sectionTitle}>{copy.title}</h2>
      {entries.map((entry, i) => {
        const Icon = moodIcon[entry.mood];
        const Art = moodArt[entry.mood];
        const isPeeked = !!peeked[entry.mood];
        return (
          <motion.article
            key={entry.mood}
            className={`${styles.scene} ${styles[entry.mood]}`}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <Art className={styles.art} />
            <div className={styles.shimmer} aria-hidden="true" />
            <div className={styles.content}>
              <Icon className={styles.icon} />
              <span className={styles.day}>Day {i + 1}</span>
              <h3 className={styles.eventTitle}>{entry.label}</h3>
              <p className={styles.eventDate}>{entry.date}</p>
              <p className={styles.eventTime}>{entry.time}</p>
              <p className={styles.eventVenue}>{entry.venue}</p>
              <p className={styles.eventFollow}>{entry.followUp}</p>

              <button
                type="button"
                className={styles.peekButton}
                onClick={() => setPeeked((prev) => ({ ...prev, [entry.mood]: !prev[entry.mood] }))}
              >
                {isPeeked ? 'Hide venue photo' : 'Peek at the venue'}
              </button>

              <AnimatePresence>
                {isPeeked && (
                  <motion.div
                    className={styles.peekPhotoWrap}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {/* PLACEHOLDER: swap with real venue photography */}
                    <img src={moodImage[entry.mood]} alt={entry.venue} className={styles.peekPhoto} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.article>
        );
      })}
    </section>
  );
}