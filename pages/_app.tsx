import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { LanguageProvider } from '../context/LanguageContext';
import { MusicProvider } from '../context/MusicContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <LanguageProvider>
      <MusicProvider>
        <Component {...pageProps} />
      </MusicProvider>
    </LanguageProvider>
  );
}

export default MyApp;