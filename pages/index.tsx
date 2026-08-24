import { useEffect, useState } from 'react';
import Head from 'next/head';
import { AnimatePresence } from 'framer-motion';
import Hero from '../components/Hero/Hero';
import HeroTitle from '../components/Hero/HeroTitle';
import FlowerBurst from '../components/Hero/FlowerBurst';
import Navigation from '../components/Navigation/Navigation';
import LanguageToggle from '../components/LanguageToggle/LanguageToggle';
import MusicController from '../components/MusicController/MusicController';
import Countdown from '../components/Countdown/Countdown';
import Intro from '../components/Intro/Intro';
import ScratchCard from '../components/ScratchCard/ScratchCard';
import Couple from '../components/Couple/Couple';
import EventTimeline from '../components/EventTimeline/EventTimeline';
import Venue from '../components/Venue/Venue';
import Gallery from '../components/Gallery/Gallery';
import Wishes from '../components/Wishes/Wishes';
import RSVP from '../components/RSVP/RSVP';
import Footer from '../components/Footer/Footer';

const HomePage = () => {
  const [isOpened, setIsOpened] = useState(false);
  const [showBurst, setShowBurst] = useState(false);
  const [dateRevealed, setDateRevealed] = useState(false);

  // Prevent scrolling behind the cinematic opening gate.
  useEffect(() => {
    document.body.style.overflow = isOpened ? '' : 'hidden';
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
            }}
          />
        )}
      </AnimatePresence>

      {showBurst && <FlowerBurst onDone={() => setShowBurst(false)} />}

      <div className={`pageGate ${isOpened ? 'pageGate--revealed' : 'pageGate--hidden'}`}>
        <Navigation />
        <LanguageToggle />
        <main>
          <HeroTitle />
          <Intro />
          <ScratchCard onReveal={() => setDateRevealed(true)} />
          {dateRevealed && <Countdown />}
          <Couple />
          <EventTimeline />
          <Venue />
          <Gallery />
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