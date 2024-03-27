import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import Heading from '@theme/Heading';
import styles from './index.module.css';

// function HomepageHeader() {
//   const {siteConfig} = useDocusaurusContext();
//   return (
//     <header className={clsx('hero hero--primary', styles.heroBanner)}>
//       <div className="container">
//         <Heading as="h1" className="hero__title">
//           {siteConfig.title}
//         </Heading>
//         <p className="hero__subtitle">{siteConfig.tagline}</p>
//         <div className={styles.buttons}>
//           <Link
//             className="button button--secondary button--lg"
//             to="/docs/docs/getting-started/configuration">
//             Pricing4SaaS Starting Tutorial - 10min ⏱️
//           </Link>
//         </div>
//       </div>
//     </header>
//   );
// }

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <div className='hero-container'>
      <div className="hero-title-container">
        <h1 className="hero-text">
          Welcome to <br />{" "}
          <h1 className="hero-text-highlighted">
            {siteConfig.title}
          </h1>
        </h1>
      </div>
      <div className="hero-subtitle-container">
        <h2 className="hero-subtitle">{siteConfig.tagline}</h2>
      </div>
      <div className="hero-button-container">
        <Link
          to="/docs/docs/getting-started/configuration"
          className="hero-button "
        >
          Starting Tutorial - 10min ⏱️
        </Link>
      </div>
    </div>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="A suite of software libraries to build scalable an flexible pricing-driven SaaS">
      <HomepageHeader />
      <main>
        {/* <HomepageFeatures /> */}
      </main>
    </Layout>
  );
}
