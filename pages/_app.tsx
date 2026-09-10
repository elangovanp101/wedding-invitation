import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { LanguageProvider } from '../context/LanguageContext';
import { MusicProvider } from '../context/MusicContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <LanguageProvider>
      <MusicProvider>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </Head>
        <Component {...pageProps} />
      </MusicProvider>
    </LanguageProvider>
  );
}

export default MyApp;