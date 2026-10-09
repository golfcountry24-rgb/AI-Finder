import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useIndexStats } from '../hooks/useIndexStats';
import { useRevealUp } from '../motion/hooks';
import { useI18n } from '../i18n';
import { NoBreak } from '../i18n/NoBreak';
import styles from './Hero.module.css';

function Stat({ value, label }) {
  const { formatNumber } = useI18n();
  return (
    <div className={styles.stat}>
      <span className={`${styles.statValue} ${value === null ? styles.pending : ''}`}>
        {formatNumber(value)}
      </span>
      <span className={styles.statLabel}>
        <NoBreak>{label}</NoBreak>
      </span>
    </div>
  );
}

export function Hero({ children }) {
  const stats = useIndexStats();
  const { t } = useI18n();
  const root = useRef(null);
  useRevealUp(root);

  return (
    <section ref={root} className="container">
      <div className={styles.panel}>
        <div className={styles.copy}>
          <p className={`eyebrow ${styles.eyebrow}`} data-reveal>
            <span className={styles.pulse} aria-hidden="true" />
            {t('hero.eyebrow')}
          </p>
          <h1 className={styles.title} data-reveal>
            <NoBreak>{t('hero.titleStart')}</NoBreak> <span className={styles.soft}><NoBreak>{t('hero.titleSoft')}</NoBreak></span>
            <span className={styles.dot}>.</span>
          </h1>
          <p className={styles.lead} data-reveal>
            {t('hero.lead')}{' '}
            <Link className="link" to="/new">
              {t('hero.leadLink')}
            </Link>
          </p>
          <div className={styles.search} data-reveal>
            {children}
          </div>
        </div>

        <aside className={styles.stats} aria-label={t('hero.statsLabel')} data-reveal>
          <span className={styles.statsHead}>{t('hero.statsHead')}</span>
          <Stat value={stats.all} label={t('hero.statAll')} />
          <Stat value={stats.startups} label={t('hero.statStartups')} />
        </aside>
      </div>
    </section>
  );
}
