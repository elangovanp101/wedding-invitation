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
          <ArchFrame accent="#7c93b8" decor="code" className={styles.archSvg} />
          <span className={styles.monogram}>Elan</span>
          <span className={`${styles.iconBadge} ${styles.iconBadgeGroom}`} aria-hidden="true">
            <img src="/images/code.gif" alt="" />
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
          <ArchFrame accent="#b9515f" decor="ecg" className={styles.archSvg} />
          <span className={styles.monogram}>Veena</span>
          <span className={`${styles.iconBadge} ${styles.iconBadgeBride}`} aria-hidden="true">
            <img src="/images/microscope.gif" alt="" />
          </span>
        </motion.figure>
      </div>
    </section>
  );
}