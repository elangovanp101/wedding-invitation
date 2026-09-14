import { useEffect, useRef, useState } from 'react';
import styles from './DJWheel.module.css';

// A real hook to scratch over, not a random pick — a recognizable few seconds in, looped.
const SCRATCH_TRACK = '/audio/tamil_song2.mp3';
const SNIPPET_START = 28;
const MIN_RATE = 0.35;
const MAX_RATE = 3;

function angleFromCenter(cx: number, cy: number, x: number, y: number) {
  return (Math.atan2(y - cy, x - cx) * 180) / Math.PI;
}

/** A real DJ jog wheel — grab the record and drag/rub it like an actual turntable platter.
 * It spins under your finger, a short hook plays back faster or slower depending on how fast
 * you're scratching, and goes silent the instant you let go — with a bit of momentum so the
 * disc keeps drifting to a stop afterwards, like the real thing. */
export default function DJWheel() {
  const vinylRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const draggingRef = useRef(false);
  const lastAngleRef = useRef(0);
  const lastTimeRef = useRef(0);
  const rotationRef = useRef(0);
  const velocityRef = useRef(0); // deg/ms, for momentum after release
  const momentumFrameRef = useRef<number | null>(null);
  const [scratching, setScratching] = useState(false);

  useEffect(() => {
    const audio = new Audio(SCRATCH_TRACK);
    audio.loop = true;
    audio.volume = 0;
    audioRef.current = audio;
    return () => {
      audio.pause();
      if (momentumFrameRef.current) cancelAnimationFrame(momentumFrameRef.current);
    };
  }, []);

  const applyRotation = (deg: number) => {
    rotationRef.current = deg;
    if (vinylRef.current) vinylRef.current.style.transform = `rotate(${deg}deg)`;
  };

  const getCenter = () => {
    const rect = vinylRef.current?.getBoundingClientRect();
    return rect ? { cx: rect.left + rect.width / 2, cy: rect.top + rect.height / 2 } : { cx: 0, cy: 0 };
  };

  const stopMomentum = () => {
    if (momentumFrameRef.current) {
      cancelAnimationFrame(momentumFrameRef.current);
      momentumFrameRef.current = null;
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    stopMomentum();
    vinylRef.current?.setPointerCapture(e.pointerId);
    draggingRef.current = true;
    setScratching(true);
    const { cx, cy } = getCenter();
    lastAngleRef.current = angleFromCenter(cx, cy, e.clientX, e.clientY);
    lastTimeRef.current = performance.now();
    const audio = audioRef.current;
    if (audio) {
      if (audio.paused) audio.currentTime = SNIPPET_START;
      audio.play().catch(() => {});
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    const { cx, cy } = getCenter();
    const angle = angleFromCenter(cx, cy, e.clientX, e.clientY);
    let delta = angle - lastAngleRef.current;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    const now = performance.now();
    const dt = Math.max(8, now - lastTimeRef.current);
    const angularVelocity = delta / dt; // deg per ms

    applyRotation(rotationRef.current + delta);
    velocityRef.current = angularVelocity;
    lastAngleRef.current = angle;
    lastTimeRef.current = now;

    const audio = audioRef.current;
    if (audio) {
      audio.playbackRate = Math.min(MAX_RATE, Math.max(MIN_RATE, Math.abs(angularVelocity) * 18));
      audio.volume = Math.min(0.85, Math.abs(angularVelocity) * 4);
    }
  };

  const endDrag = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setScratching(false);
    audioRef.current?.pause();

    // A bit of momentum so the disc keeps drifting to a stop, like a real platter — purely
    // visual, the audio has already gone silent.
    let v = velocityRef.current;
    const step = () => {
      v *= 0.94;
      applyRotation(rotationRef.current + v * 16);
      if (Math.abs(v) > 0.002) {
        momentumFrameRef.current = requestAnimationFrame(step);
      } else {
        momentumFrameRef.current = null;
      }
    };
    momentumFrameRef.current = requestAnimationFrame(step);
  };

  return (
    <div className={styles.wheelSection}>
      <p className={styles.wheelLabel}>Feel like a DJ? Grab the record and scratch it 🎧</p>
      <div className={styles.turntable}>
        <div
          ref={vinylRef}
          className={`${styles.vinyl} ${scratching ? styles.vinylActive : ''}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          onPointerCancel={endDrag}
        >
          <span className={styles.sheen} />
          <span className={styles.label}>Elan ♥ Veena</span>
        </div>
        <span className={`${styles.tonearm} ${scratching ? styles.tonearmDown : ''}`} />
      </div>
      <p className={styles.hint}>{scratching ? 'Scratching…' : 'Touch & drag the record'}</p>
    </div>
  );
}
