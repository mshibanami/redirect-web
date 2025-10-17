import type { ReactNode } from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.scss';
import useBaseUrl from '@docusaurus/useBaseUrl';

type FeatureItem = {
  title: string;
  icon: string;
  thumbnail?: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Powerful Redirection Engine',
    icon: '🎯',
    thumbnail: '/img/landing-feature-redirection-engine.png',
    description: "Create precise rules using wildcards, regular expressions, excluded URL patterns, capture group processing, DNR, and more.",
  },
  {
    title: 'Useful Rules in Library',
    icon: '📚',
    thumbnail: '/img/landing-feature-library.png',
    description: "Quick start with useful pre-made rules from the Library section in the app.",
  },
  {
    title: 'Native UI',
    icon: '✨',
    thumbnail: '/img/landing-feature-native-ui.png',
    description: "Redirect Web offers a native app to provide a seamless experience on each platform.",
  },
  {
    title: 'Cross-Browser & Cross-Platform',
    icon: '🖥️📱🥽',
    thumbnail: '/img/landing-feature-multi-platform.png',
    description: "Available in Any browser on Mac; Safari on iPhone, iPad, and Apple Vision Pro.",
  },
  {
    title: 'Unlock All for $4',
    icon: '💎',
    description: "Unlock iCloud Sync, unlimited rules, and future premium features with a one-time payment for the price of a coffee.",
  },
];

function Feature({ title, icon, thumbnail, description }: FeatureItem) {
  return (
    <div className={clsx('col col--6', styles.feature)}>
      <div className={clsx('card', styles.featureCard)}>
        <div className="card__header">
          {thumbnail && (
            <img className={styles.featureThumbnail} src={useBaseUrl(thumbnail)} alt={title} />
          )}
          <Heading as="h3"><span className={styles.featureIcon}>{icon}</span> {title}</Heading>
        </div>
        <div className="card__body">
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <Heading as="h2" className='margin-bottom--lg'>Why Redirect Web?</Heading>
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
