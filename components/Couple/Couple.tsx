import { motion } from 'framer-motion';
import styles from './Couple.module.css';
import ArchFrame from './ArchFrame';
import { useLanguage } from '../../context/LanguageContext';
import { weddingData } from '../../data/wedding';

export default function Couple() {
  const { language, t } = useLanguage();
  const content = weddingData.couple[language === 'ta' ? 'tamil' : 'english'];

  return (
    <section id="our-story" className={styles.section}>
      <motion.h2
        className={styles.title}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.9 }}
      >
        {t.invitation.couple.title}
      </motion.h2>

      <div className={styles.gallery}>
        <motion.figure
          className={styles.photo}
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1 }}
        >
          {/* PLACEHOLDER: swap this arch frame for Elangovan's portrait */}
          <ArchFrame accent="#7c93b8" className={styles.archSvg} />
          <span className={styles.monogram}>Elan</span>
          <span className={`${styles.iconBadge} ${styles.iconBadgeGroom}`} aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
              <circle cx="12" cy="12" r="3.1" />
              <path d="M12 3.5v2.6M12 17.9v2.6M3.5 12h2.6M17.9 12h2.6M6.1 6.1l1.8 1.8M16.1 16.1l1.8 1.8M6.1 17.9l1.8-1.8M16.1 7.9l1.8-1.8" />
            </svg>
          </span>
        </motion.figure>

        <motion.div
          className={styles.center}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <span className={styles.ornament}>✦</span>
          <h3 className={`${styles.names} ${language === 'ta' ? styles.tamilText : ''}`}>{content.name}</h3>
          <p className={`${styles.story} ${language === 'ta' ? styles.tamilText : ''}`}>{content.story}</p>

          <div className={styles.route}>
            <span className={styles.routePoint}>{t.invitation.couple.originPerson1}</span>
            <span className={styles.routeLine}>
              <motion.span
                className={styles.routeDot}
                animate={{ left: ['0%', '100%', '0%'] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              />
            </span>
            <span className={styles.routePoint}>{t.invitation.couple.originPerson2}</span>
          </div>
          <p className={styles.routeCaption}>{t.invitation.couple.routeCaption}</p>
        </motion.div>

        <motion.figure
          className={styles.photo}
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1 }}
        >
          {/* PLACEHOLDER: swap this arch frame for Selvaveena's portrait */}
          <ArchFrame accent="#b9515f" className={styles.archSvg} />
          <span className={styles.monogram}>Veena</span>
          <span className={`${styles.iconBadge} ${styles.iconBadgeBride}`} aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
              <path d="M7.5 3v6a4.5 4.5 0 0 0 9 0V3" />
              <circle cx="18.7" cy="14.5" r="2.2" />
              <circle cx="7.5" cy="2.6" r="1" />
              <circle cx="12" cy="2.6" r="1" />
            </svg>
          </span>
        </motion.figure>
      </div>
    </section>
  );
}