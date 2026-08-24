import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { translations, Translations, Language } from '../data/translations';

type LanguageContextValue = {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  t: Translations[Language];
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage: setLanguageState,
      toggleLanguage: () => setLanguageState((prev) => (prev === 'en' ? 'ta' : 'en')),
      t: translations[language],
    }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
}
