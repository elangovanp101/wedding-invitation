import { useEffect, useLayoutEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import styles from './CarCrashIntro.module.css';
import HeroTunnelLights from './HeroTunnelLights';

// useLayoutEffect warns during SSR (no DOM to measure yet) but is exactly what we want on the
// client — it fires before the browser paints, so the real, viewport-based offsets are in place
// before anything is visible, with no wrong frame and no server/client hydration mismatch.
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

// Simple timeline: two cars race in fast and stop side by side with a clear gap between them, a
// tunnel of fairy lights glows to life immediately, a heart pops out, then the invitation appears.
const IMPACT_T = 0.9;
const TUNNEL_IN_T = IMPACT_T; // lights begin the instant the cars stop
const HEART_IN_T = IMPACT_T + 0.3;
const TITLE_IN_T = TUNNEL_IN_T + 1.4;
const TITLE_FADE_DURATION = 0.9;
const HOLD_AFTER_TITLE = 1.0;
const FADE_OUT_DURATION = 0.5;
const TOTAL_DURATION = TITLE_IN_T + TITLE_FADE_DURATION + HOLD_AFTER_TITLE + FADE_OUT_DURATION;

// Exported so Hero.tsx knows when this scene has fully faded out and can reveal the real names.
export const CRASH_INTRO_DURATION_MS = TOTAL_DURATION * 1000;

function CarSilhouette({ flipped }: { flipped?: boolean }) {
  return (
    <svg
      viewBox="0 0 120 50"
      className={styles.carSvg}
      style={{ transform: flipped ? 'scaleX(-1)' : undefined }}
      aria-hidden="true"
    >
      <path d="M6,38 L18,38 L26,22 L70,22 L84,38 L114,38 L114,44 L6,44 Z" fill="rgba(205,168,107,0.85)" />
      <circle cx="28" cy="44" r="7" fill="#0e0b09" stroke="rgba(205,168,107,0.9)" strokeWidth="2" />
      <circle cx="92" cy="44" r="7" fill="#0e0b09" stroke="rgba(205,168,107,0.9)" strokeWidth="2" />
    </svg>
  );
}

/** Two cars race in and collide; a heart pops out as the "byproduct" — then the names begin. */
export default function CarCrashIntro({ onBang }: { onBang?: () => void }) {
  const reduceMotion = useReducedMotion();
  // Same fixed default on server and first client render (no hydration mismatch), then updated
  // to the real viewport-based offsets in useIsomorphicLayoutEffect below — before paint, so the
  // guest never sees the placeholder frame and Framer never has to retarget mid-animation.
  const [carOffsets, setCarOffsets] = useState({ start: 800, gap: 70 });

  useIsomorphicLayoutEffect(() => {
    const vw = window.innerWidth;
    setCarOffsets({ start: vw * 0.8, gap: Math.max(48, Math.min(90, vw * 0.08)) });
  }, []);

  // Tells Hero the fairy-light tunnel has begun glowing, so music starts right with it — the
  // earliest moment autoplay could ever succeed (still needs a prior gesture per browser
  // policy; MusicContext primes the track muted from load and unmutes here without one).
  useEffect(() => {
    if (reduceMotion) {
      onBang?.();
      return;
    }
    const timer = setTimeout(() => onBang?.(), TUNNEL_IN_T * 1000);
    return () => clearTimeout(timer);
  }, [reduceMotion, onBang]);

  if (reduceMotion) return null;

  return (
    <motion.div
      className={styles.stage}
      animate={{ opacity: [1, 1, 0] }}
      transition={{
        duration: TOTAL_DURATION,
        times: [0, (TOTAL_DURATION - FADE_OUT_DURATION) / TOTAL_DURATION, 1],
        ease: 'easeInOut',
      }}
      aria-hidden="true"
    >
      <HeroTunnelLights startDelay={TUNNEL_IN_T} />

      <motion.div
        className={`${styles.car} ${styles.carLeft}`}
        initial={{ x: `calc(-50% - ${carOffsets.start}px)`, opacity: 0.9 }}
        animate={{ x: `calc(-50% - ${carOffsets.gap}px)` }}
        transition={{ duration: IMPACT_T, ease: [0.22, 1, 0.36, 1] }}
      >
        <CarSilhouette />
      </motion.div>

      <motion.div
        className={`${styles.car} ${styles.carRight}`}
        initial={{ x: `calc(-50% + ${carOffsets.start}px)`, opacity: 0.9 }}
        animate={{ x: `calc(-50% + ${carOffsets.gap}px)` }}
        transition={{ duration: IMPACT_T, ease: [0.22, 1, 0.36, 1] }}
      >
        <CarSilhouette flipped />
      </motion.div>

      <div className={styles.heart}>
        <motion.span
          className={styles.heartInner}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [0, 1.3, 1, 0.6] }}
          transition={{ duration: 1, delay: HEART_IN_T, times: [0, 0.3, 0.75, 1] }}
        >
          ♥
        </motion.span>
      </div>

      <div className={styles.invitationPopup}>
        <motion.div
          className={styles.invitationInner}
          initial={{ opacity: 0, scale: 0.92, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: TITLE_IN_T, duration: TITLE_FADE_DURATION, ease: [0.25, 1, 0.5, 1] }}
        >
          <span className={styles.invitationLine} />
          <span className={styles.invitationText}>Wedding Invitation</span>
          <span className={styles.invitationLine} />
        </motion.div>
      </div>
    </motion.div>
  );
}