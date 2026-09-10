import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import styles from './Footer.module.css';
import TunnelLights from './TunnelLights';
import { useLanguage } from '../../context/LanguageContext';
import { weddingData } from '../../data/wedding';

const SHARE_TITLE = 'Elangovan ♥ Selvaveena — Wedding Invitation';
const SHARE_TEXT = 'Join Elangovan & Selvaveena as they celebrate their wedding in Bangalore!';

/** Doubles as the site's final emotional closing section. */
export default function Footer() {
  const { t } = useLanguage();
  const copy = t.invitation.footer;
  const [copied, setCopied] = useState(false);
  // Starts empty so server and first client render match exactly, then fills in post-mount —
  // reading window.location during render itself caused a hydration mismatch.
  const [pageUrl, setPageUrl] = useState('');

  useEffect(() => {
    setPageUrl(window.location.href);
  }, []);

  const handleNativeShare = async () => {
    const url = pageUrl;
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

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
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

      {/* Share the invitation — WhatsApp/Facebook open a share dialog, Instagram opens the
          native share sheet (Instagram has no direct web-share URL), and the link button
          just copies the URL. */}
      <div className={styles.shareBar}>
        <span className={styles.shareLabel}>Share the joy</span>
        <div className={styles.shareButtons}>
          <a
            className={styles.shareButton}
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${SHARE_TEXT} ${pageUrl}`)}`}
            aria-label="Share on WhatsApp"
          >
            <img src="/icons/whatsapp.png" alt="" className={styles.shareIcon} />
          </a>
          <a
            className={styles.shareButton}
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`}
            aria-label="Share on Facebook"
          >
            <img src="/icons/fb.png" alt="" className={styles.shareIcon} />
          </a>
          <button type="button" className={styles.shareButton} onClick={handleNativeShare} aria-label="Share on Instagram">
            <img src="/icons/instagram.png" alt="" className={styles.shareIcon} />
          </button>
          <button type="button" className={styles.shareButton} onClick={handleCopyLink} aria-label="Copy link">
            <img src="/icons/link.png" alt="" className={styles.shareIcon} />
          </button>
        </div>
        {copied ? <span className={styles.copiedNote}>Link copied ✦</span> : null}
      </div>

      <div className={styles.bottomBar}>
        <p className={styles.rights}>{copy.rights}</p>
        <div className={styles.links}>
          <a href="#wishes">{t.invitation.nav.wishes}</a>
          <a href="#rsvp">{t.invitation.nav.rsvp}</a>
        </div>
        <p className={styles.copyright}>© Einweit Technologies Private Limited, Bangalore</p>
      </div>
    </footer>
  );
}