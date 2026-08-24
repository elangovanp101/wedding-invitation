import { motion } from 'framer-motion';
import styles from './RSVP.module.css';
import { useLanguage } from '../../context/LanguageContext';
import { weddingData, googleCalendarUrl, icsDataUrl } from '../../data/wedding';

const EVENT_KEYS = ['churchWedding', 'reception', 'traditionalWedding'] as const;

/** "Save These Dates" — replaces the old RSVP form with per-event calendar reminders. */
export default function RSVP() {
  const { t } = useLanguage();
  const copy = t.invitation.rsvp;
  const eventsCopy = t.invitation.events;

  return (
    <section id="rsvp" className={styles.section}>
      <h2 className={styles.title}>{copy.title}</h2>
      <p className={styles.subtitle}>{copy.subtitle}</p>

      <div className={styles.grid}>
        {weddingData.events.map((event, i) => {
          const label = eventsCopy[EVENT_KEYS[i]].label;
          return (
            <motion.div
              key={event.key}
              className={styles.card}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8, delay: i * 0.12 }}
            >
              <span className={styles.day}>Day {i + 1}</span>
              <h3 className={styles.eventTitle}>{label}</h3>
              <p className={styles.eventDate}>
                {event.date} · {event.time}
              </p>
              <div className={styles.actions}>
                <a href={googleCalendarUrl(event)} target="_blank" rel="noopener noreferrer">
                  {copy.google}
                </a>
                <a href={icsDataUrl(event)} download={`${label}.ics`}>
                  {copy.appleOutlook}
                </a>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}