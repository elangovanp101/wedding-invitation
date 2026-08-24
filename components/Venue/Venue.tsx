import { motion } from 'framer-motion';
import styles from './Venue.module.css';
import { useLanguage } from '../../context/LanguageContext';
import { weddingData } from '../../data/wedding';
import { ChurchIcon, ReceptionIcon, TraditionalIcon } from '../icons/MoodIcons';

export default function Venue() {
  const { t } = useLanguage();
  const copy = t.invitation.venue;

  const venues = [
    {
      mood: styles.church,
      icons: [ChurchIcon],
      name: weddingData.venues.church.name,
      address: weddingData.venues.church.address,
      viewMapUrl: weddingData.venues.church.viewMapUrl,
      directionsUrl: weddingData.venues.church.directionsUrl,
    },
    {
      mood: styles.palace,
      icons: [ReceptionIcon, TraditionalIcon],
      name: weddingData.venues.reception.name,
      address: weddingData.venues.reception.address,
      viewMapUrl: weddingData.venues.reception.viewMapUrl,
      directionsUrl: weddingData.venues.reception.directionsUrl,
    },
  ];

  return (
    <section id="venue" className={styles.section}>
      <h2 className={styles.title}>{copy.title}</h2>
      <div className={styles.grid}>
        {venues.map((venue, i) => (
          <motion.div
            key={venue.name}
            className={`${styles.card} ${venue.mood}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, delay: i * 0.15 }}
          >
            <div className={styles.icons}>
              {venue.icons.map((Icon, idx) => (
                <Icon key={idx} className={styles.icon} />
              ))}
            </div>
            <h3>{venue.name}</h3>
            <p>{venue.address}</p>
            <div className={styles.actions}>
              <a href={venue.viewMapUrl} target="_blank" rel="noopener noreferrer">
                {copy.viewMap}
              </a>
              <a href={venue.directionsUrl} target="_blank" rel="noopener noreferrer">
                {copy.getDirections}
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}