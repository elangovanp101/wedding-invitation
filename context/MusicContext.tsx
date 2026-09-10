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
  /** Plays a short one-shot sound (e.g. church bell) once per visit, layered over the main track. */
  playSting: (key: 'church' | 'traditional') => void;
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
  // True once a play() call has actually succeeded — after that we stop retrying autoplay.
  const unlockedRef = useRef(false);
  // True while the guest has explicitly paused via the control — the autoplay-retry
  // listener must never override that (this was the "music restarts on any click" bug).
  const userPausedRef = useRef(false);
  const stingRef = useRef<HTMLAudioElement | null>(null);
  const playedStingsRef = useRef<Set<string>>(new Set());

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSection, setCurrentSection] = useState<MusicSection>('english');
  // Mirrors currentSection for use inside start(), which is a stable useCallback and would
  // otherwise close over a stale 'english' default regardless of the page's actual language.
  const currentSectionRef = useRef<MusicSection>('english');
  useEffect(() => {
    currentSectionRef.current = currentSection;
  }, [currentSection]);

  useEffect(() => {
    const a = new Audio();
    const b = new Audio();
    a.loop = true;
    b.loop = true;
    a.preload = 'auto';
    b.preload = 'none';
    a.volume = 0;
    b.volume = 0;
    a.src = weddingData.musicTracks.english;
    audioARef.current = a;
    audioBRef.current = b;

    // Muted autoplay is allowed by every browser without a gesture — prime the track silently
    // from the moment the page loads, then unmute it later (see fadeTo) with no play() needed.
    a.muted = true;
    a.play().catch(() => {});

    const sting = new Audio();
    sting.preload = 'none';
    stingRef.current = sting;

    return () => {
      a.pause();
      b.pause();
      sting.pause();
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
    };
  }, []);

  // If the gate auto-opened without a click, the browser blocks autoplay until the
  // guest's first real interaction anywhere on the page — retry playback then.
  // Stops entirely once autoplay is confirmed unlocked, or once the guest intentionally pauses,
  // so a stray tap elsewhere on the page never resumes music the guest turned off.
  useEffect(() => {
    const retry = () => {
      if (!hasStartedRef.current || unlockedRef.current || userPausedRef.current) return;
      const active = activeRef.current === 'A' ? audioARef.current : audioBRef.current;
      if (active && (active.paused || active.muted)) {
        active.muted = false;
        active
          .play()
          .then(() => {
            setIsPlaying(true);
            unlockedRef.current = true;
          })
          .catch(() => {});
      }
    };
    const events: (keyof DocumentEventMap)[] = ['pointerdown', 'keydown', 'touchstart'];
    events.forEach((evt) => document.addEventListener(evt, retry, { passive: true }));
    return () => events.forEach((evt) => document.removeEventListener(evt, retry));
  }, []);

  const fadeTo = useCallback((incoming: HTMLAudioElement, outgoing: HTMLAudioElement | null) => {
    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
    const steps = FADE_MS / FADE_STEP_MS;
    let step = 0;
    incoming.volume = 0;
    // Reveals sound on a track that (for the main English track) is very likely already
    // silently autoplaying from page load — no play() call needing a gesture is required.
    incoming.muted = false;
    incoming
      .play()
      .then(() => {
        setIsPlaying(true);
        unlockedRef.current = true;
      })
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
      userPausedRef.current = false;
      // Picks whichever track matches the page's language at this point (e.g. /tamil forces
      // 'ta' before this ever runs) instead of the English default baked in at mount time.
      const targetSrc = weddingData.musicTracks[currentSectionRef.current];
      if (targetSrc) {
        a.src = targetSrc;
        a.currentTime = 0;
      }
      fadeTo(a, null);
      return;
    }
    // Already attempted once — if it was blocked by autoplay policy, retry on this call.
    if ((a.paused || a.muted) && !userPausedRef.current) {
      a.muted = false;
      a.play().then(() => {
        setIsPlaying(true);
        unlockedRef.current = true;
      }).catch(() => {});
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
      userPausedRef.current = true;
    } else {
      userPausedRef.current = false;
      active
        .play()
        .then(() => {
          setIsPlaying(true);
          unlockedRef.current = true;
        })
        .catch(() => {});
    }
  }, [isPlaying, start]);

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

  // Short one-shot sound (church bell / traditional chant) layered over the main track once
  // per visit, when a guest scrolls into that celebration's section. Doesn't affect the loop.
  const playSting = useCallback((key: 'church' | 'traditional') => {
    if (playedStingsRef.current.has(key)) return;
    const src = weddingData.stingTracks[key];
    if (!src) return;
    playedStingsRef.current.add(key);
    const sting = stingRef.current;
    if (!sting) return;
    sting.src = src;
    sting.currentTime = 0;
    sting.volume = 0.65;
    sting.play().catch(() => {});
  }, []);

  return (
    <MusicContext.Provider value={{ isPlaying, currentSection, start, toggle, setSection, playSting }}>
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error('useMusic must be used within a MusicProvider');
  return ctx;
}
