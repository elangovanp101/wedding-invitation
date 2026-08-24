import { motion } from 'framer-motion';
import styles from './HeroTitle.module.css';
import { useLanguage } from '../../context/LanguageContext';

/**
 * Persistent title band. Unlike the opening gate (which unmounts after the guest
 * opens the invitation), this stays in the page and replays its reveal every time
 * a guest scrolls back to the top.
 */
export default function HeroTitle() {
  const { t } = useLanguage();

  return (
    <section id="home" className={styles.heroTitle}>
      <motion.div
        className={styles.inner}
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.7 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1 className={styles.names}>
          Elangovan <span className={styles.heart}>♥</span> Selvaveena
        </h1>
        <p className={styles.tagline}>{t.invitation.hero.inviteText}</p>
      </motion.div>
    </section>
  );
}
