import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ScratchCard.module.css';

const REVEAL_THRESHOLD = 0.6;
const CONFETTI_COLORS = ['#cda86b', '#e8d3a4', '#8f2a3a', '#f4ead9', '#5c7d6b'];

function ConfettiBurst({ onDone }: { onDone: () => void }) {
  const pieces = useRef(
    Array.from({ length: 70 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      size: 6 + Math.random() * 9,
      duration: 2.4 + Math.random() * 1.8,
      delay: Math.random() * 0.5,
      rotate: Math.random() * 360,
    }))
  ).current;

  useEffect(() => {
    const timer = setTimeout(onDone, 4400);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className={styles.confettiLayer} aria-hidden="true">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className={styles.confettiPiece}
          style={{ left: `${p.x}%`, width: p.size, height: p.size * 0.4, background: p.color }}
          initial={{ y: '-10vh', opacity: 1, rotate: 0 }}
          animate={{ y: '110vh', opacity: [1, 1, 0], rotate: p.rotate }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
        />
      ))}
    </div>
  );
}

/** Scratch-to-reveal the wedding date, then a full-page confetti burst. */
export default function ScratchCard({ onReveal }: { onReveal?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const scratchingRef = useRef(false);
  const moveCountRef = useRef(0);
  const [revealed, setRevealed] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [hasTouched, setHasTouched] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#8a6a3a');
    gradient.addColorStop(1, '#caa669');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(20,14,8,0.85)';
    ctx.font = '600 0.85rem Manrope, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SCRATCH TO REVEAL', width / 2, height / 2 + 4);
  }, []);

  // Only the middle needs to be cleared — no need to scratch the whole card.
  const checkProgress = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || revealed) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { width, height } = canvas;
    const boxW = width * 0.34;
    const boxH = height * 0.4;
    const startX = Math.floor((width - boxW) / 2);
    const startY = Math.floor((height - boxH) / 2);
    const region = ctx.getImageData(startX, startY, boxW, boxH).data;
    let cleared = 0;
    let sampled = 0;
    for (let i = 3; i < region.length; i += 4 * 4) {
      sampled += 1;
      if (region[i] === 0) cleared += 1;
    }
    if (cleared / sampled > REVEAL_THRESHOLD) {
      setRevealed(true);
      setShowConfetti(true);
      onReveal?.();
      ctx.clearRect(0, 0, width, height);
    }
  }, [revealed, onReveal]);

  const scratchAt = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(clientX - rect.left, clientY - rect.top, 24, 0, Math.PI * 2);
    ctx.fill();
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    scratchingRef.current = true;
    setHasTouched(true);
    scratchAt(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!scratchingRef.current) return;
    scratchAt(e.clientX, e.clientY);
    moveCountRef.current += 1;
    if (moveCountRef.current % 6 === 0) checkProgress();
  };

  const handlePointerUp = () => {
    scratchingRef.current = false;
    checkProgress();
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Wedding Date</h2>
      <p className={styles.subtitle}>Scratch the card below to reveal our wedding date</p>

      <div className={styles.cardWrap}>
        <div className={styles.reveal}>
          <span className={styles.revealDate}>11th · 12th · 13th</span>
          <span className={styles.revealMonth}>NOVEMBER 2026</span>
          <span className={styles.revealNote}>See you there ✦</span>
        </div>
        {!revealed && (
          <canvas
            ref={canvasRef}
            className={styles.canvas}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          />
        )}
        {!revealed && !hasTouched && (
          <motion.div
            className={styles.fingerHint}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, x: [-16, 16, -16] }}
            transition={{ opacity: { duration: 0.6 }, x: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' } }}
            aria-hidden="true"
          >
            👆
          </motion.div>
        )}
      </div>

      <AnimatePresence>{showConfetti && <ConfettiBurst onDone={() => setShowConfetti(false)} />}</AnimatePresence>
    </section>
  );
}
