import { motion } from 'framer-motion';
import styles from './EnvelopeReveal.module.css';

/** A brief, gentle envelope-flap unfold the moment the guest opens the invitation. */
export default function EnvelopeReveal() {
  return (
    <div className={styles.stage} aria-hidden="true">
      <motion.div
        className={styles.flap}
        initial={{ rotateX: 0, opacity: 1 }}
        animate={{ rotateX: -165, opacity: [1, 1, 0] }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.div
        className={styles.glow}
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: [0, 0.7, 0], scale: 1.25 }}
        transition={{ duration: 1.1, delay: 0.15, ease: 'easeOut' }}
      />
    </div>
  );
}
