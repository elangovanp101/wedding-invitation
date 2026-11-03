import { motion, useReducedMotion } from 'framer-motion';
import styles from './BusShuttle.module.css';
import { useLanguage } from '../../context/LanguageContext';
import { weddingData } from '../../data/wedding';

export default function BusShuttle() {
  const { t } = useLanguage();
  const copy = t.invitation.busShuttle;
  const shuttle = weddingData.busShuttle;
  const reduceMotion = useReducedMotion();

  return (
    <section id="bus-shuttle" className={styles.section}>
      <h2 className={styles.title}>{copy.title}</h2>
      <p className={styles.subtitle}>{copy.subtitle}</p>

      <div className={styles.routeWrap}>
        <div className={styles.routeLine}>
          <motion.span
            className={`${styles.bus} ${styles.busPickup}`}
            aria-hidden="true"
            animate={reduceMotion ? { left: '50%' } : { left: ['0%', '100%'] }}
            transition={reduceMotion ? { duration: 0 } : { duration: 4.5, repeat: Infinity, ease: 'linear' }}
          >
            🚌
          </motion.span>
          <motion.span
            className={`${styles.bus} ${styles.busDrop}`}
            aria-hidden="true"
            animate={reduceMotion ? { left: '50%' } : { left: ['100%', '0%'] }}
            transition={reduceMotion ? { duration: 0 } : { duration: 4.5, repeat: Infinity, ease: 'linear', delay: 2.25 }}
          >
            🚌
          </motion.span>
        </div>
        <div className={styles.routeEnds}>
          <span>{shuttle.pickupLocation.split(',')[0]}</span>
          <span>{shuttle.destination}</span>
        </div>
        <p className={styles.routeCaption}>{copy.routeCaption}</p>
      </div>

      <div className={styles.grid}>
        <motion.div
          className={styles.card}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8 }}
        >
          <span className={styles.cardLabel}>{copy.pickupLabel}</span>
          <p className={styles.locationLine}>
            <strong>{copy.pickupLocationLabel}:</strong> {shuttle.pickupLocation}
          </p>
          <p className={styles.dateLine}>{shuttle.date}</p>
          <ul className={styles.timeList}>
            {shuttle.pickupTimes.map((time) => (
              <li key={time}>{time}</li>
            ))}
          </ul>
          <a href={shuttle.pickupMapUrl} target="_blank" rel="noopener noreferrer" className={styles.mapLink}>
            {copy.viewMap}
          </a>
        </motion.div>

        <motion.div
          className={styles.card}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          <span className={styles.cardLabel}>{copy.dropLabel}</span>
          <p className={styles.locationLine}>
            <strong>{copy.destinationLabel}:</strong> {shuttle.destination} → {shuttle.pickupLocation.split(',')[0]}
          </p>
          <p className={styles.dateLine}>{shuttle.date}</p>
          <ul className={styles.timeList}>
            {shuttle.dropTimes.map((time) => (
              <li key={time}>{time}</li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
