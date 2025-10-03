import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import React, {useEffect, useState} from 'react';
import styles from './index.module.css';

function SphereHero() {
  const { siteConfig } = useDocusaurusContext();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // trigger entrance animations after mount
    const id = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(id);
  }, []);

  // We will render a CSS-only hero (no external video) — responsive and centered.
  return (
    <header className={styles.heroRoot} role="banner" aria-label="SPHERE documentation hero">
      <div className={styles.heroInner + (mounted ? ` ${styles.enter}` : '')}>
        <div className={styles.leftCol}>
          <h1 className={styles.brand}>
            SPHERE
          </h1>

          <p className={styles.subtitle}>
            An ecosystem to operate SaaS through pricing models.
          </p>

          <div className={styles.actions}>
            <Link
              to={`/docs/${siteConfig.customFields.currentVersion}/docs/getting-started/configuration`}
              className={styles.primaryButton}
            >
              Get Started
            </Link>

            <a
              href={siteConfig.customFields?.githubUrl || 'https://github.com'}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.secondaryButton}
            >
              View on GitHub
            </a>
          </div>
        </div>

        <div className={styles.rightCol} aria-hidden>
          <div className={styles.blob} />
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="A suite of software libraries to build scalable an flexible pricing-driven SaaS">
      <SphereHero />
      <main>
        {/* <HomepageFeatures /> */}
      </main>
    </Layout>
  );
}
