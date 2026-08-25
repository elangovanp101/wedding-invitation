import { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './Footer.module.css';
import TunnelLights from './TunnelLights';
import { useLanguage } from '../../context/LanguageContext';
import { weddingData } from '../../data/wedding';

const SHARE_TITLE = 'Elangovan ♥ Selvaveena — Wedding Invitation';
const SHARE_TEXT = 'Join Elangovan & Selvaveena as they celebrate their wedding in Bangalore!';

function currentUrl() {
  return typeof window !== 'undefined' ? window.location.href : '';
}

/** Doubles as the site's final emotional closing section. */
export default function Footer() {
  const { t } = useLanguage();
  const copy = t.invitation.footer;
  const [copied, setCopied] = useState(false);

  const handleNativeShare = async () => {
    const url = currentUrl();
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: SHARE_TITLE, text: SHARE_TEXT, url });
        return;
      } catch {
        /* guest cancelled the share sheet — no fallback needed */
        return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      /* clipboard unavailable — nothing more we can do silently */
    }
  };

  return (
    <footer className={styles.footer}>
      {/* Handwritten note, scroll-revealed like breath wiped across a mirror */}
      <motion.p
        className={styles.saveTheDate}
        initial={{ clipPath: 'inset(0 100% 0 0)', opacity: 0.5 }}
        whileInView={{ clipPath: 'inset(0 0% 0 0)', opacity: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
      >
        Save the date.
      </motion.p>

      <motion.div
        className={styles.closing}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1 }}
      >
        <div className={styles.tunnelWrap}>
          <TunnelLights className={styles.tunnelLights} />
        </div>
        <span className={styles.kicker}>{copy.closingStatement}</span>
        <h2 className={styles.names}>{weddingData.couple.english.name}</h2>
        <p className={styles.namesTamil}>{weddingData.couple.tamil.name}</p>
        <p className={styles.thankYou}>{copy.thankYou}</p>
      </motion.div>

      {/* Share the invitation — WhatsApp/Facebook open a share dialog; the third button uses the
          native share sheet on mobile, or copies the link on desktop. */}
      <div className={styles.shareBar}>
        <span className={styles.shareLabel}>Share the joy</span>
        <div className={styles.shareButtons}>
          <a
            className={styles.shareButton}
            href={`https://wa.me/?text=${encodeURIComponent(`${SHARE_TEXT} ${currentUrl()}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on WhatsApp"
          >
            WhatsApp
          </a>
          <a
            className={styles.shareButton}
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl())}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on Facebook"
          >
            Facebook
          </a>
          <button type="button" className={styles.shareButton} onClick={handleNativeShare}>
            {copied ? 'Link copied ✦' : 'Copy link'}
          </button>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <p className={styles.rights}>{copy.rights}</p>
        <div className={styles.links}>
          <a href="#wishes">{t.invitation.nav.wishes}</a>
          <a href="#rsvp">{t.invitation.nav.rsvp}</a>
        </div>
      </div>
    </footer>
  );
}