import { motion } from 'framer-motion';
import styles from './Footer.module.css';
import { useLanguage } from '../../context/LanguageContext';
import { weddingData } from '../../data/wedding';

/** Doubles as the site's final emotional closing section. */
export default function Footer() {
  const { t } = useLanguage();
  const copy = t.invitation.footer;

  return (
    <footer className={styles.footer}>
      <motion.div
        className={styles.closing}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1 }}
      >
        <span className={styles.kicker}>{copy.closingStatement}</span>
        <h2 className={styles.names}>{weddingData.couple.english.name}</h2>
        <p className={styles.namesTamil}>{weddingData.couple.tamil.name}</p>
        <p className={styles.thankYou}>{copy.thankYou}</p>
      </motion.div>

      <div className={styles.bottomBar}>
        <p className={styles.rights}>{copy.rights}</p>
        <div className={styles.links}>
          <a href="#wishes">{t.invitation.nav.wishes}</a>
          <a href="#rsvp">{t.invitation.nav.rsvp}</a>
        </div>
      </div>
    </footer>
  );
}