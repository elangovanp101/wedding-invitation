import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import { AnimatePresence } from 'framer-motion';
import Hero from '../components/Hero/Hero';
import HeroTitle from '../components/Hero/HeroTitle';
import FlowerBurst from '../components/Hero/FlowerBurst';
import Fireworks from '../components/Fireworks/Fireworks';
import Navigation from '../components/Navigation/Navigation';
import LanguageToggle from '../components/LanguageToggle/LanguageToggle';
import MusicController from '../components/MusicController/MusicController';
import Thoranam from '../components/Thoranam/Thoranam';
import FairyLights from '../components/Thoranam/FairyLights';
import Countdown from '../components/Countdown/Countdown';
import Intro from '../components/Intro/Intro';
import ScratchCard from '../components/ScratchCard/ScratchCard';
import Couple from '../components/Couple/Couple';
import EventTimeline from '../components/EventTimeline/EventTimeline';
import Venue from '../components/Venue/Venue';
import Wishes from '../components/Wishes/Wishes';
import RSVP from '../components/RSVP/RSVP';
import Footer from '../components/Footer/Footer';

const HomePage = () => {
  const [isOpened, setIsOpened] = useState(false);
  const [showBurst, setShowBurst] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [showTopFireworks, setShowTopFireworks] = useState(false);
  const [dateRevealed, setDateRevealed] = useState(false);
  const wasAtTopRef = useRef(true);

  // Prevent scrolling behind the cinematic opening gate.
  useEffect(() => {
    document.body.style.overflow = isOpened ? '' : 'hidden';
  }, [isOpened]);

  // Fireworks celebrate again every time the guest scrolls back up to the very top —
  // not just once on the opening moment.
  useEffect(() => {
    if (!isOpened) return;
    const handleScroll = () => {
      const atTop = window.scrollY < 40;
      if (atTop && !wasAtTopRef.current) setShowTopFireworks(true);
      wasAtTopRef.current = atTop;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOpened]);

  return (
    <>
      <Head>
        <title>Elangovan ♥ Selvaveena — Wedding Invitation</title>
        <meta
          name="description"
          content="Join Elangovan and Selvaveena as they celebrate their wedding in Bangalore on 11, 12 and 13 November 2026."
        />
        <meta property="og:title" content="Elangovan ♥ Selvaveena — Wedding Invitation" />
        <meta
          property="og:description"
          content="Join Elangovan and Selvaveena as they celebrate their wedding in Bangalore on 11, 12 and 13 November 2026."
        />
        <meta property="og:type" content="website" />
        {/* PLACEHOLDER: replace /public/og-image.jpg with the final invitation artwork */}
        <meta property="og:image" content="/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <AnimatePresence>
        {!isOpened && (
          <Hero
            key="hero"
            onOpen={() => {
              setIsOpened(true);
              setShowBurst(true);
              setShowFireworks(true);
            }}
          />
        )}
      </AnimatePresence>

      {showBurst && <FlowerBurst onDone={() => setShowBurst(false)} />}
      {showFireworks && <Fireworks onDone={() => setShowFireworks(false)} />}
      {showTopFireworks && <Fireworks onDone={() => setShowTopFireworks(false)} />}

      <div className={`pageGate ${isOpened ? 'pageGate--revealed' : 'pageGate--hidden'}`}>
        <Thoranam />
        <FairyLights />
        <Navigation />
        <LanguageToggle
          onSwitch={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setShowTopFireworks(true);
          }}
        />
        <main>
          <HeroTitle />
          <Intro />
          <ScratchCard onReveal={() => setDateRevealed(true)} />
          {dateRevealed && <Countdown />}
          <Couple />
          <EventTimeline />
          <Venue />
          <Wishes />
          <RSVP />
        </main>
        <Footer />
        <MusicController />
      </div>
    </>
  );
};

export default HomePage;