import { motion } from 'framer-motion';
import styles from './Intro.module.css';
import { useLanguage } from '../../context/LanguageContext';

export default function Intro() {
  const { t } = useLanguage();
  const copy = t.invitation.intro;

  return (
    <section className={styles.intro}>
      <img src="/images/couples.png" alt="" className={styles.coupleGif} />
      <motion.span
        className={styles.kicker}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.9 }}
      >
        {copy.statement}
      </motion.span>
      <motion.p
        className={styles.details}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1, delay: 0.15 }}
      >
        {copy.details}
      </motion.p>
      <motion.div
        className={styles.divider}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.3 }}
      />
    </section>
  );
}