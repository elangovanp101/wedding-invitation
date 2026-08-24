import styles from './LanguageToggle.module.css';
import { useLanguage } from '../../context/LanguageContext';

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button type="button" className={styles.toggle} onClick={toggleLanguage} aria-label="Switch language">
      {language === 'en' ? 'தமிழ்' : 'EN'}
    </button>
  );
}