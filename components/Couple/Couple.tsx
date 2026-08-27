import { motion } from 'framer-motion';
import styles from './Couple.module.css';
import ArchFrame from './ArchFrame';
import { useLanguage } from '../../context/LanguageContext';
import { weddingData } from '../../data/wedding';

/** A laptop silhouette — engineering, shown rather than named (the gears now turn inside the arch). */
function ComputerIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="5" width="16" height="10" rx="1" />
      <path d="M2 19h20l-2-3H4Z" />
      <path d="M9 15h6" />
    </svg>
  );
}

/** A microscope silhouette — medicine/research, shown rather than named. */
function MicroscopeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 21h8" />
      <path d="M12 21v-3.5" />
      <path d="M7 17.5h10a1 1 0 0 0 1-1.2l-.6-3a1 1 0 0 0-1-.8H7.6a1 1 0 0 0-1 .8l-.6 3a1 1 0 0 0 1 1.2Z" />
      <path d="M10 12.5V9a2 2 0 0 1 2-2h0" />
      <path d="M12 3v2.2" />
      <path d="M9.5 5.2h5" />
      <circle cx="16.5" cy="9" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

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
          <ArchFrame accent="#7c93b8" decor="snow" className={styles.archSvg} />
          <span className={styles.monogram}>Elan</span>
          <span className={`${styles.iconBadge} ${styles.iconBadgeGroom}`} aria-hidden="true">
            <ComputerIcon />
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
            <MicroscopeIcon />
          </span>
        </motion.figure>
      </div>
    </section>
  );
}