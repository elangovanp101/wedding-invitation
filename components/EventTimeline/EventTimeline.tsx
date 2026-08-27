import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import styles from './EventTimeline.module.css';
import { useLanguage } from '../../context/LanguageContext';
import { useMusic } from '../../context/MusicContext';
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

export default function EventTimeline() {
  const { t } = useLanguage();
  const music = useMusic();
  const copy = t.invitation.events;
  const sceneRefs = useRef<Record<string, HTMLElement | null>>({});

  const entries = [
    { mood: 'church', ...copy.churchWedding },
    { mood: 'reception', ...copy.reception },
    { mood: 'traditional', ...copy.traditionalWedding },
  ];

  // Plays a short bell/chant sting once, layered over the main track, the moment a guest
  // scrolls a church or traditional scene into view (reception has no sting — no data yet).
  useEffect(() => {
    const observer = new IntersectionObserver(
      (observedEntries) => {
        observedEntries.forEach((observed) => {
          if (!observed.isIntersecting) return;
          const mood = observed.target.getAttribute('data-mood');
          if (mood === 'church' || mood === 'traditional') music.playSting(mood);
        });
      },
      { threshold: 0.5 }
    );
    Object.values(sceneRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [music]);

  return (
    <section id="celebrations" className={styles.section}>
      <h2 className={styles.sectionTitle}>{copy.title}</h2>
      {entries.map((entry, i) => {
        const Icon = moodIcon[entry.mood];
        const Art = moodArt[entry.mood];
        return (
          <motion.article
            key={entry.mood}
            ref={(el) => { sceneRefs.current[entry.mood] = el; }}
            data-mood={entry.mood}
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
            </div>
          </motion.article>
        );
      })}
    </section>
  );
}