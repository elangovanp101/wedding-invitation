import React, { useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import styles from './CarCrashIntro.module.css';

// Exact timeline offsets matching traffic light triggers
const LIGHT_YELLOW_T = 0.8;
const LIGHT_GREEN_T = 1.4; // Cars launch immediately when green turns on!
const DRIVE_DURATION = 1.3; // Cars drive for 1.3 seconds
const IMPACT_T = LIGHT_GREEN_T + DRIVE_DURATION; // 2.7s
const HEART_IN_T = IMPACT_T + 0.1; // 2.8s
const TITLE_IN_T = HEART_IN_T + 0.15; // popup (and music) arrive right after the heart settles
const TITLE_FADE_DURATION = 0.9;
const HOLD_AFTER_TITLE = 0.6; // let the popup stay fully visible before handing off to Hero
const FADE_OUT_DURATION = 0.4;
const TOTAL_DURATION = TITLE_IN_T + TITLE_FADE_DURATION + HOLD_AFTER_TITLE + FADE_OUT_DURATION;

// Exported so Hero.tsx knows when the intro scene has fully faded out and can reveal the real names.
export const CAR_CRASH_DURATION_MS = TOTAL_DURATION * 1000;

// Minimalist golden traffic light component
function TrafficLight() {
  return (
    <div className={styles.trafficLightContainer}>
      <div className={styles.lightPole} />
      <div className={styles.lightBox}>
        {/* Red Light */}
        <motion.div
          className={`${styles.lightCircle} ${styles.lightRed}`}
          initial={{ opacity: 0.2, filter: 'grayscale(0.8)' }}
          animate={{ 
            opacity: [1, 1, 0.2], 
            filter: ['grayscale(0)', 'grayscale(0)', 'grayscale(0.8)']
          }}
          transition={{ duration: LIGHT_YELLOW_T, times: [0, 0.9, 1], ease: 'linear' }}
        />
        {/* Yellow Light */}
        <motion.div
          className={`${styles.lightCircle} ${styles.lightYellow}`}
          initial={{ opacity: 0.2, filter: 'grayscale(0.8)' }}
          animate={{ 
            opacity: [0.2, 0.2, 1, 1, 0.2], 
            filter: ['grayscale(0.8)', 'grayscale(0.8)', 'grayscale(0)', 'grayscale(0)', 'grayscale(0.8)']
          }}
          transition={{ duration: LIGHT_GREEN_T, times: [0, 0.55, 0.58, 0.9, 1], ease: 'linear' }}
        />
        {/* Green Light */}
        <motion.div
          className={`${styles.lightCircle} ${styles.lightGreen}`}
          initial={{ opacity: 0.2, filter: 'grayscale(0.8)' }}
          animate={{ 
            opacity: [0.2, 1], 
            filter: ['grayscale(0.8)', 'grayscale(0)']
          }}
          transition={{ delay: LIGHT_GREEN_T, duration: 0.2, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

// Elegant gold-etched Indian Highway kilometer-stone milestones
interface MilestoneProps {
  state: 'KA' | 'TN';
}
function Milestone({ state }: MilestoneProps) {
  return (
    <div className={styles.milestoneSign}>
      <div className={styles.milestoneCap} />
      <div className={styles.milestoneHeader}>{state}</div>
      <div className={styles.milestoneBody}>
        <span className={styles.milestoneText}>{state === 'KA' ? '09' : '14'}</span>
        <div className={styles.milestoneLine} />
        <span className={styles.milestoneSub}>{state === 'KA' ? 'BLR' : 'OOTY'}</span>
      </div>
    </div>
  );
}

// Car Silhouette — profession is now shown only by the flying keepsake at impact, not a text tag
interface CarSilhouetteProps {
  flipped?: boolean;
  profession: 'engineer' | 'doctor';
}
function CarSilhouette({ flipped, profession }: CarSilhouetteProps) {
  // Cars share the same gold body, but each carries a profession-tinted stripe
  // so the two riders read as distinct people at a glance, not just a mirrored car.
  const accent = profession === 'engineer' ? '#7c93b8' : '#b9515f';
  return (
    <svg
      viewBox="0 0 120 50"
      className={styles.carSvg}
      style={{ transform: flipped ? 'scaleX(-1)' : undefined }}
      aria-hidden="true"
    >
      {/* Golden Car Body from your original code */}
      <path
        d="M6,38 L18,38 L26,22 L70,22 L84,38 L114,38 L114,44 L6,44 Z"
        fill="rgba(205,168,107,0.85)"
        stroke="rgba(205,168,107,0.3)"
        strokeWidth="1"
      />

      {/* Profession-tinted racing stripe so the two cars read as distinct at speed */}
      <path d="M26,30 L84,30 L84,34 L26,34 Z" fill={accent} opacity="0.85" />

      {/* Tires */}
      <circle cx="28" cy="44" r="7" fill="#0e0b09" stroke="rgba(205,168,107,0.9)" strokeWidth="2" />
      <circle cx="92" cy="44" r="7" fill="#0e0b09" stroke="rgba(205,168,107,0.9)" strokeWidth="2" />
    </svg>
  );
}

/** Small keepsake that pops out of a car at impact, tumbles through the air, then lands and
 * stays put on the road — shows the rider's profession through what they were carrying,
 * instead of naming it outright. */
function FlyingKeepsake({ profession, direction }: { profession: 'engineer' | 'doctor'; direction: 'left' | 'right' }) {
  const sign = direction === 'left' ? -1 : 1;
  return (
    <motion.svg
      viewBox="0 0 40 40"
      className={styles.keepsake}
      initial={{ opacity: 0, x: 0, y: 0, rotate: 0, scale: 0.6 }}
      animate={{
        opacity: [0, 1, 1, 1],
        x: sign * 72,
        y: [-6, -55, -20, 10],
        rotate: sign * 260,
        scale: 1,
      }}
      transition={{ duration: 1.3, delay: IMPACT_T + 0.05, times: [0, 0.3, 0.65, 1], ease: 'easeOut' }}
      aria-hidden="true"
    >
      {profession === 'engineer' ? (
        // Laptop tumbling away from the engineer's car
        <g fill="none" stroke="#f4ead9" strokeWidth="2" strokeLinejoin="round">
          <rect x="8" y="10" width="24" height="15" rx="1.5" />
          <path d="M4,29 L36,29 L33,25 L7,25 Z" fill="#f4ead9" stroke="none" />
        </g>
      ) : (
        // Stethoscope tumbling away from the doctor's car
        <g fill="none" stroke="#f4ead9" strokeWidth="2" strokeLinecap="round">
          <path d="M12,8 v9 a8,8 0 0 0 16,0 V8" />
          <circle cx="28" cy="24" r="4" fill="#f4ead9" stroke="none" />
          <circle cx="12" cy="6" r="2" />
          <circle cx="20" cy="6" r="2" />
        </g>
      )}
    </motion.svg>
  );
}

/** Theme-colored heart — replaces the red emoji so it never clashes with the gold/ivory palette. */
function GoldHeart() {
  return (
    <svg viewBox="0 0 32 28" className={styles.heartSvg} aria-hidden="true">
      <path
        d="M16,26 C16,26 2,17 2,8.5 C2,3.8 5.8,1 9.5,1 C12.4,1 14.8,2.8 16,5.2 C17.2,2.8 19.6,1 22.5,1 C26.2,1 30,3.8 30,8.5 C30,17 16,26 16,26 Z"
        fill="url(#heartGoldGradient)"
        stroke="rgba(244,234,217,0.6)"
        strokeWidth="0.6"
      />
      <defs>
        <linearGradient id="heartGoldGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f4ead9" />
          <stop offset="55%" stopColor="#cda86b" />
          <stop offset="100%" stopColor="#8f2a3a" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function CarCrashIntro({ onBang }: { onBang?: () => void }) {
  const reduceMotion = useReducedMotion();

  // Tells Hero the car has crashed and the heart has popped, so music can start right then —
  // this is the earliest moment autoplay could ever succeed (still needs a prior user gesture
  // per browser policy; see MusicContext for the retry-on-first-interaction fallback).
  useEffect(() => {
    if (reduceMotion) {
      onBang?.();
      return;
    }
    const timer = setTimeout(() => onBang?.(), HEART_IN_T * 1000);
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
    >
      {/* Golden Invitation background aesthetic line patterns */}
      <div className={styles.aestheticGrid} />

      {/* Fairy lights strung across the top of the scene */}
      <div className={styles.fairyLights} aria-hidden="true">
        {Array.from({ length: 14 }, (_, i) => (
          <span key={i} className={styles.fairyBulb} style={{ animationDelay: `${(i % 5) * 0.4}s` }} />
        ))}
      </div>

      {/* Traffic Light Sequence */}
      <motion.div 
        className={styles.trafficLightWrapper}
        animate={{ y: [0, 0, -200], opacity: [1, 1, 0] }}
        transition={{ delay: IMPACT_T, duration: 0.6, ease: 'easeIn' }}
      >
        <TrafficLight />
      </motion.div>

      {/* Milestone signs gracefully fading in on the sides */}
      <motion.div
        className={`${styles.milestoneWrapper} ${styles.milestoneLeft}`}
        initial={{ opacity: 0, scale: 0.8, x: -30 }}
        animate={{ opacity: 0.9, scale: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
      >
        <Milestone state="KA" />
      </motion.div>

      <motion.div
        className={`${styles.milestoneWrapper} ${styles.milestoneRight}`}
        initial={{ opacity: 0, scale: 0.8, x: 30 }}
        animate={{ opacity: 0.9, scale: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
      >
        <Milestone state="TN" />
      </motion.div>

      {/* Master Animation Stage: shakes on collision and HOLDS frame */}
      <motion.div
        className={styles.collisionStage}
        animate={{ x: [0, -14, 12, -9, 7, -4, 2, 0], y: [0, -6, 5, -3, 2, 0], scale: [1, 1.04, 0.99, 1] }}
        transition={{ duration: 0.5, delay: IMPACT_T, ease: 'easeOut' }}
      >
        {/* Left Car: Engineer (KA) - starts very slow, finishes extremely fast */}
        <motion.div
          className={`${styles.car} ${styles.carLeft}`}
          initial={{ x: '-60vw' }}
          animate={{ x: '-3vw' }}
          transition={{ 
            delay: LIGHT_GREEN_T, 
            duration: DRIVE_DURATION, 
            ease: [0.88, 0.05, 0.85, 0.15] // Custom flat-then-vertical ease curve
          }}
        >
          <CarSilhouette profession="engineer" />
        </motion.div>

        {/* Right Car: Doctor (TN) - starts very slow, finishes extremely fast */}
        <motion.div
          className={`${styles.car} ${styles.carRight}`}
          initial={{ x: '60vw' }}
          animate={{ x: '3vw' }}
          transition={{ 
            delay: LIGHT_GREEN_T, 
            duration: DRIVE_DURATION, 
            ease: [0.88, 0.05, 0.85, 0.15] 
          }}
        >
          <CarSilhouette flipped profession="doctor" />
        </motion.div>

        {/* Shockwave ring punching outward from the point of impact — the heart now marks
            the impact itself, so there's no separate star-like flash burst */}
        <motion.div
          className={styles.shockwave}
          initial={{ opacity: 0, scale: 0.2 }}
          animate={{ opacity: [0.9, 0], scale: 3.2 }}
          transition={{ duration: 0.5, delay: IMPACT_T, ease: 'easeOut' }}
        />

        {/* Cracks radiating from the point of impact, etched in and left behind */}
        <motion.svg
          className={styles.crack}
          viewBox="0 0 200 200"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.7] }}
          transition={{ duration: 0.4, delay: IMPACT_T + 0.05 }}
          aria-hidden="true"
        >
          <g stroke="rgba(244,234,217,0.8)" strokeWidth="1.5" fill="none" strokeLinecap="round">
            <path d="M100,100 L70,60 M100,100 L60,105 M100,100 L75,140" />
            <path d="M100,100 L130,55 M100,100 L142,100 M100,100 L122,145" />
          </g>
        </motion.svg>

        {/* Profession keepsakes tumbling free of each car at the moment of impact */}
        <FlyingKeepsake profession="engineer" direction="left" />
        <FlyingKeepsake profession="doctor" direction="right" />

        {/* Heart bursts from the collision, then keeps growing while fading away — no infinite pulse */}
        <motion.span
          className={styles.heart}
          initial={{ opacity: 0, scale: 0, y: 10 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [0, 1.3, 1.9, 2.6], y: [10, -45, -60, -78] }}
          transition={{
            duration: TOTAL_DURATION - HEART_IN_T,
            delay: HEART_IN_T,
            times: [0, 0.18, 0.55, 1],
            ease: 'easeOut',
          }}
        >
          <GoldHeart />
        </motion.span>

        {/* Wedding invitation popup: fades in centered once the heart settles */}
        <motion.div
          className={styles.invitationPopup}
          initial={{ opacity: 0, scale: 0.92, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: TITLE_IN_T, duration: TITLE_FADE_DURATION, ease: [0.25, 1, 0.5, 1] }}
        >
          <span className={styles.invitationLine} />
          <span className={styles.invitationText}>Wedding Invitation</span>
          <span className={styles.invitationLine} />
        </motion.div>
      </motion.div>

      {/* Full-screen white punch — the actual "bang" flashbulb moment */}
      <motion.div
        className={styles.screenFlash}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.9, 0] }}
        transition={{ duration: 0.22, delay: IMPACT_T, ease: 'easeOut' }}
      />
    </motion.div>
  );
}
