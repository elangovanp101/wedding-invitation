import styles from './LanguageToggle.module.css';
import { useLanguage } from '../../context/LanguageContext';

type Props = { onSwitch?: () => void };

export default function LanguageToggle({ onSwitch }: Props) {
  const { language, toggleLanguage } = useLanguage();

  const handleClick = () => {
    toggleLanguage();
    onSwitch?.();
  };

  return (
    <button type="button" className={styles.toggle} onClick={handleClick} aria-label="Switch language">
      {language === 'en' ? 'தமிழ்' : 'EN'}
    </button>
  );
}