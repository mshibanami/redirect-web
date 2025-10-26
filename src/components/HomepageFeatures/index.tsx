import type { ReactNode } from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.scss';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Translate, { translate } from '@docusaurus/Translate';

type FeatureItem = {
  title: string;
  icon: string;
  thumbnail?: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: translate({
      id: 'landingPage.feature.redirectionEngine.title',
      message: 'Powerful Redirection Engine',
      description: 'Landing page feature title for powerful redirection engine'
    }),
    icon: '🎯',
    thumbnail: '/img/landing-feature-redirection-engine.png',
    description: translate({
      id: 'landingPage.feature.redirectionEngine.description',
      message: "Create precise rules using wildcards, regular expressions, excluded URL patterns, capture group processing, DNR, and more.",
      description: 'Landing page feature description for powerful redirection engine'
    }),
  },
  {
    title: translate({
      id: 'landingPage.feature.library.title',
      message: 'Useful Rules in Library',
      description: 'Landing page feature title for useful rules in library'
    }),
    icon: '📚',
    thumbnail: '/img/landing-feature-library.png',
    description: translate({
      id: 'landingPage.feature.library.description',
      message: "Quick start with useful pre-made rules from the Library section in the app.",
      description: 'Landing page feature description for useful rules in library'
    }),
  },
  {
    title: translate({
      id: 'landingPage.feature.nativeUI.title',
      message: 'Native UI',
      description: 'Landing page feature title for native UI'
    }),
    icon: '✨',
    thumbnail: '/img/landing-feature-native-ui.png',
    description: translate({
      id: 'landingPage.feature.nativeUI.description',
      message: "Redirect Web offers a native app to provide a seamless experience on each platform.",
      description: 'Landing page feature description for native UI'
    }),
  },
  {
    title: translate({
      id: 'landingPage.feature.crossBrowser.title',
      message: 'Cross-Browser & Cross-Platform',
      description: 'Landing page feature title for cross-browser and cross-platform support'
    }),
    icon: '🖥️📱🥽',
    thumbnail: '/img/landing-feature-multi-platform.png',
    description: translate({
      id: 'landingPage.feature.crossBrowser.description',
      message: "Available in all major browsers on Mac; Safari on iPhone, iPad, and Apple Vision Pro.",
      description: 'Landing page feature description for cross-browser and cross-platform support'
    }),
  },
  {
    title: translate({
      id: 'landingPage.feature.unlockAll.title',
      message: 'Unlock All for $4',
      description: 'Landing page feature title for unlocking all features'
    }),
    icon: '💎',
    description: translate({
      id: 'landingPage.feature.unlockAll.description',
      message: "Unlock iCloud Sync, unlimited rules, and future premium features with a one-time payment for the price of a coffee.",
      description: 'Landing page feature description for unlocking all features'
    }),
  },
];

function Feature({ title, icon, thumbnail, description }: FeatureItem) {
  return (
    <div className={clsx('col col--6', styles.feature)}>
      <div className={styles.featureCard}>

        {thumbnail && (
          <img className={styles.featureThumbnail} src={useBaseUrl(thumbnail)} alt={title} />
        )}
        <div className={styles.featureCardBody}>
          <Heading as="h3"><span className={styles.featureIcon}>{icon}</span> {title}</Heading>

          <p>{description}</p>
        </div>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={clsx('zooming', styles.features)}>
      <div className="container">
        <Heading as="h2" className='margin-bottom--lg'>
          <Translate
            id="landingPage.productFeatures.title"
            description="Title for the product features section."
            values={{ productName: 'Redirect Web' }}>
            {'Why {productName}?'}
          </Translate>
        </Heading>
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
