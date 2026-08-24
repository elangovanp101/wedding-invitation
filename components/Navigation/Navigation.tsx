import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Navigation.module.css';
import { useLanguage } from '../../context/LanguageContext';

const links = [
  { id: 'home', key: 'home' },
  { id: 'our-story', key: 'ourStory' },
  { id: 'celebrations', key: 'celebrations' },
  { id: 'venue', key: 'venue' },
  { id: 'gallery', key: 'gallery' },
  { id: 'wishes', key: 'wishes' },
  { id: 'rsvp', key: 'rsvp' },
] as const;

/** Discreet floating navigation — no full navbar, expands into a small menu on demand. */
export default function Navigation() {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

  const handleNavigate = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={styles.wrapper}>
      <AnimatePresence>
        {open && (
          <motion.ul
            className={styles.menu}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.35 }}
          >
            {links.map((link) => (
              <li key={link.id}>
                <button type="button" onClick={() => handleNavigate(link.id)}>
                  {t.invitation.nav[link.key]}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close navigation' : 'Open navigation'}
        aria-expanded={open}
      >
        <span className={`${styles.bar} ${open ? styles.barOpenTop : ''}`} />
        <span className={`${styles.bar} ${open ? styles.barOpenMid : ''}`} />
        <span className={`${styles.bar} ${open ? styles.barOpenBottom : ''}`} />
      </button>
    </div>
  );
}