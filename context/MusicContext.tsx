import { createContext, useContext, useCallback, useEffect, useRef, useState, ReactNode } from 'react';
import { weddingData, MusicSection } from '../data/wedding';

type MusicContextValue = {
  isPlaying: boolean;
  currentSection: MusicSection;
  /** Begins playback on first user interaction (or auto-open). Safe to call more than once. */
  start: () => void;
  toggle: () => void;
  /** Crossfades to the track mapped to this section. See data/wedding.ts musicTracks. */
  setSection: (section: MusicSection) => void;
  /** Layers a short one-shot sound (e.g. a church bell) on top of the background music. */
  playOneShot: (src: string, volume?: number) => void;
};

const MusicContext = createContext<MusicContextValue | undefined>(undefined);

const FADE_MS = 1500;
const FADE_STEP_MS = 50;
const MAX_VOLUME = 0.55;

export function MusicProvider({ children }: { children: ReactNode }) {
  const audioARef = useRef<HTMLAudioElement | null>(null);
  const audioBRef = useRef<HTMLAudioElement | null>(null);
  const activeRef = useRef<'A' | 'B'>('A');
  const fadeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasStartedRef = useRef(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSection, setCurrentSection] = useState<MusicSection>('english');

  useEffect(() => {
    const a = new Audio();
    const b = new Audio();
    a.loop = true;
    b.loop = true;
    a.preload = 'none';
    b.preload = 'none';
    a.volume = 0;
    b.volume = 0;
    a.src = weddingData.musicTracks.english;
    audioARef.current = a;
    audioBRef.current = b;

    return () => {
      a.pause();
      b.pause();
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
    };
  }, []);

  // Note: playback is only ever started/stopped by start()/toggle() (i.e. the music control
  // button or the Open Invitation click) — nothing resumes it on random taps elsewhere on the page.

  const fadeTo = useCallback((incoming: HTMLAudioElement, outgoing: HTMLAudioElement | null) => {
    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
    const steps = FADE_MS / FADE_STEP_MS;
    let step = 0;
    incoming.volume = 0;
    incoming
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => {
        /* autoplay blocked — start() can be called again later (e.g. on Open Invitation) to retry */
      });
    fadeIntervalRef.current = setInterval(() => {
      step += 1;
      const progress = Math.min(1, step / steps);
      incoming.volume = MAX_VOLUME * progress;
      if (outgoing) outgoing.volume = MAX_VOLUME * (1 - progress);
      if (progress >= 1) {
        outgoing?.pause();
        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
      }
    }, FADE_STEP_MS);
  }, []);

  const start = useCallback(() => {
    const a = audioARef.current;
    if (!a) return;
    if (!hasStartedRef.current) {
      hasStartedRef.current = true;
      fadeTo(a, null);
      return;
    }
    // Already attempted once — if it was blocked by autoplay policy, retry on this call.
    if (a.paused) {
      a.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, [fadeTo]);

  const toggle = useCallback(() => {
    if (!hasStartedRef.current) {
      start();
      return;
    }
    const active = activeRef.current === 'A' ? audioARef.current : audioBRef.current;
    if (!active) return;
    if (isPlaying) {
      active.pause();
      setIsPlaying(false);
    } else {
      active
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  }, [isPlaying, start]);

  const playOneShot = useCallback((src: string, volume = 0.5) => {
    const sfx = new Audio(src);
    sfx.volume = volume;
    sfx.play().catch(() => {});
  }, []);

  const setSection = useCallback(
    (section: MusicSection) => {
      setCurrentSection((prev) => {
        if (prev === section) return prev;
        const src = weddingData.musicTracks[section];
        if (!hasStartedRef.current || !src) return section;

        const outgoing = activeRef.current === 'A' ? audioARef.current : audioBRef.current;
        const incomingRef = activeRef.current === 'A' ? audioBRef : audioARef;
        const incoming = incomingRef.current;
        if (incoming) {
          incoming.src = src;
          incoming.currentTime = 0;
          activeRef.current = activeRef.current === 'A' ? 'B' : 'A';
          fadeTo(incoming, outgoing);
        }
        return section;
      });
    },
    [fadeTo]
  );

  return (
    <MusicContext.Provider value={{ isPlaying, currentSection, start, toggle, setSection }}>
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error('useMusic must be used within a MusicProvider');
  return ctx;
}
