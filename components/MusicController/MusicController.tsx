import { useEffect } from 'react';
import styles from './MusicController.module.css';
import { useMusic } from '../../context/MusicContext';
import { useLanguage } from '../../context/LanguageContext';

/** Persistent, unobtrusive music control. Playback/crossfade logic lives in MusicContext. */
export default function MusicController() {
  const { isPlaying, toggle, setSection } = useMusic();
  const { language } = useLanguage();

  // Only two tracks: crossfade between them when the guest switches language.
  useEffect(() => {
    setSection(language === 'ta' ? 'tamil' : 'english');
  }, [language, setSection]);

  return (
    <button
      type="button"
      className={styles.control}
      onClick={toggle}
      aria-label={isPlaying ? 'Pause music' : 'Play music'}
      aria-pressed={isPlaying}
    >
      <span className={`${styles.bars} ${isPlaying ? styles.playing : ''}`}>
        <span />
        <span />
        <span />
      </span>
    </button>
  );
}