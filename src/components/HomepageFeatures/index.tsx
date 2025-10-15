import type { ReactNode } from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  icon: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Powerful Redirection Engine',
    icon: '🎯',
    description: "Create precise rules using wildcards, regular expressions, excluded URL patterns, and more, with intuitive UI.",
  },
  {
    title: 'Multi-Platform',
    icon: '🖥️📱🥽',
    description: "Seamlessly works across all your Apple devices, including Mac, iPhone, iPad, and Apple Vision Pro."
  },
  {
    title: 'Blazing Fast',
    icon: '⚡️',
    description: "Support for modern APIs like DNR (Declarative Net Request) enables extremely fast redirection.",
  },
  {
    title: 'Useful Rules in Library',
    icon: '📚',
    description: "Quick start with useful pre-made rules from the Library section in the app.",
  },
  {
    title: 'Unlock All for $4',
    icon: '💎',
    description: "iCloud Sync, unlimited rules, and future premium features for the price of a coffee.",
  },
  {
    title: 'Privacy-Focused',
    icon: '🔒',
    description: "No ads, no tracking. Your data is yours. The extension only does what it says it does.",
  },
];

function Feature({ title, icon, description }: FeatureItem) {
  return (
    <div className={clsx('col col--6', styles.feature)}>
      <div className={clsx('card', styles.featureCard)}>
        <div className="card__header">
          <div className={styles.featureIcon}>{icon}</div>
          <Heading as="h3">{title}</Heading>
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
