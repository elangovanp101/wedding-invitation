import Image from 'next/image';
import { motion } from 'framer-motion';
import styles from './Gallery.module.css';
import { useLanguage } from '../../context/LanguageContext';
import { weddingData } from '../../data/wedding';

const sizeClass: Record<string, string> = {
  wide: 'wide',
  tall: 'tall',
  square: 'square',
};

export default function Gallery() {
  const { t } = useLanguage();
  const copy = t.invitation.gallery;

  return (
    <section id="gallery" className={styles.section}>
      <h2 className={styles.title}>{copy.title}</h2>
      <p className={styles.subtitle}>{copy.subtitle}</p>
      <div className={styles.grid}>
        {weddingData.gallery.map((item, i) => (
          <motion.figure
            key={`${item.src}-${i}`}
            className={`${styles.item} ${styles[sizeClass[item.size]]}`}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: (i % 3) * 0.1 }}
          >
            {/* PLACEHOLDER: swap src in data/wedding.ts gallery[] with real photography */}
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className={styles.image}
              loading="lazy"
            />
          </motion.figure>
        ))}
      </div>
    </section>
  );
}