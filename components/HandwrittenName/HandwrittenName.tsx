import { motion, useReducedMotion } from 'framer-motion';
import styles from './HandwrittenName.module.css';

export type HandwrittenPath = { d: string };

export type HandwrittenNameProps = {
  /** Fallback text rendered until real handwritten artwork is supplied. */
  text: string;
  /** Used to pick the right fallback font stack. */
  lang?: 'en' | 'ta';
  /**
   * TODO(replace-me): once handwritten SVG artwork is available (e.g. traced from
   * /public/fonts/elangovan.svg), pass the extracted <path> "d" data here. The component
   * will automatically switch to a true stroke-draw animation instead of the text fallback.
   */
  paths?: HandwrittenPath[];
  viewBox?: string;
  as?: 'h1' | 'h2' | 'span';
  duration?: number;
  delay?: number;
  className?: string;
};

export default function HandwrittenName({
  text,
  lang = 'en',
  paths,
  viewBox = '0 0 600 200',
  as = 'span',
  duration = 2.2,
  delay = 0,
  className = '',
}: HandwrittenNameProps) {
  const reduceMotion = useReducedMotion();
  const Tag = as;

  if (paths && paths.length > 0) {
    return (
      <svg className={`${styles.svgName} ${className}`} viewBox={viewBox} role="img" aria-label={text}>
        {paths.map((p, i) => (
          <motion.path
            key={i}
            d={p.d}
            className={styles.strokePath}
            initial={reduceMotion ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0.4 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: reduceMotion ? 0 : duration,
              delay: reduceMotion ? 0 : delay + i * 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        ))}
      </svg>
    );
  }

  return (
    <Tag className={`${styles.fallbackName} ${lang === 'ta' ? styles.tamil : ''} ${className}`}>
      <motion.span
        className={styles.reveal}
        initial={reduceMotion ? { clipPath: 'inset(0 0% 0 0)' } : { clipPath: 'inset(0 100% 0 0)' }}
        animate={{ clipPath: 'inset(0 0% 0 0)' }}
        transition={{ duration: reduceMotion ? 0 : duration, delay: reduceMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {text}
      </motion.span>
    </Tag>
  );
}
