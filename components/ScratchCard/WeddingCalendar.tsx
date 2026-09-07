import { motion } from 'framer-motion';
import styles from './WeddingCalendar.module.css';

const YEAR = 2026;
const MONTH = 10; // November (0-indexed)
const WEDDING_DAYS = [11, 12, 13];
const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

/** A November 2026 calendar, revealed after the scratch card, with the three wedding
 * days highlighted in hearts. */
export default function WeddingCalendar() {
  const firstWeekday = new Date(YEAR, MONTH, 1).getDay();
  const daysInMonth = new Date(YEAR, MONTH + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <motion.div
      className={styles.calendar}
      initial={{ opacity: 0, scale: 0.94, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <p className={styles.month}>NOVEMBER 2026</p>
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <defs>
          <linearGradient id="heartCalendarGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e5c88e" />
            <stop offset="100%" stopColor="#b9515f" />
          </linearGradient>
        </defs>
      </svg>
      <div className={styles.grid}>
        {WEEKDAY_LABELS.map((d, i) => (
          <span key={i} className={styles.weekday}>
            {d}
          </span>
        ))}
        {cells.map((day, i) => {
          const isWeddingDay = day !== null && WEDDING_DAYS.includes(day);
          return (
            <span key={i} className={`${styles.day} ${isWeddingDay ? styles.dayWedding : ''}`}>
              {isWeddingDay && (
                <svg viewBox="0 0 24 22" className={styles.heartShape} aria-hidden="true">
                  <path d="M12,20 C12,20 2,13 2,6.8 C2,3 4.8,1 7.6,1 C9.6,1 11.2,2.2 12,4 C12.8,2.2 14.4,1 16.4,1 C19.2,1 22,3 22,6.8 C22,13 12,20 12,20 Z" />
                </svg>
              )}
              <span className={styles.dayNumber}>{day ?? ''}</span>
            </span>
          );
        })}
      </div>
      <p className={styles.note}>More details below ✦</p>
    </motion.div>
  );
}
