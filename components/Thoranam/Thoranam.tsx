import styles from './Thoranam.module.css';

const LEAF_COUNT = 12;

/**
 * Decorative hanging toranam garlands fixed to the left/right edges of the viewport,
 * visible throughout the site (behind content, non-interactive).
 * PLACEHOLDER: simple CSS/SVG leaf-and-bell motif — swap for finer artwork later if desired.
 */
export default function Thoranam() {
  const leaves = Array.from({ length: LEAF_COUNT });

  return (
    <>
      <div className={`${styles.strand} ${styles.left}`} aria-hidden="true">
        <svg className={styles.rope} viewBox="0 0 20 100" preserveAspectRatio="none">
          <line x1="10" y1="0" x2="10" y2="100" stroke="rgba(205,168,107,0.35)" strokeWidth="1" />
        </svg>
        {leaves.map((_, i) => (
          <span
            key={i}
            className={styles.leaf}
            style={{ top: `${(i / LEAF_COUNT) * 100}%`, animationDelay: `${i * 0.35}s` }}
          />
        ))}
      </div>
      <div className={`${styles.strand} ${styles.right}`} aria-hidden="true">
        <svg className={styles.rope} viewBox="0 0 20 100" preserveAspectRatio="none">
          <line x1="10" y1="0" x2="10" y2="100" stroke="rgba(205,168,107,0.35)" strokeWidth="1" />
        </svg>
        {leaves.map((_, i) => (
          <span
            key={i}
            className={styles.leaf}
            style={{ top: `${(i / LEAF_COUNT) * 100}%`, animationDelay: `${i * 0.35}s` }}
          />
        ))}
      </div>
    </>
  );
}
