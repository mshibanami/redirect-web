import type { ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';
import ExtensionStoreLinks from '@site/src/components/ExtensionStoreLinks';
import Award from '@site/src/components/Award';
import LandingPageBackground from '@site/src/components/LandingPageBackground';
import Image from "@site/src/components/Image";
import styles from './index.module.scss';
import AppleLogo from '@site/static/img/apple-logo.svg';
import Translate from '@docusaurus/Translate';

function HomepageHeader() {
    const { siteConfig } = useDocusaurusContext();
    return (
        <header className={clsx('hero', styles.heroBanner)}>
            <LandingPageBackground style={{ height: "600px", width: "100%" }} />
            <div className={clsx("container", styles.heroContainer)}>
                <Image
                    src={useBaseUrl('/img/logo.png')}
                    alt="Redirect Web Library Screenshot"
                    width={100}
                    margin='80px 0' />

                <Heading as="h1" className="hero__title">
                    {siteConfig.tagline}
                </Heading>
                <p className="hero__subtitle">
                    <Translate
                        id="landingPage.heroSubtitle"
                        description="Landing page hero subtitle"
                        values={{ appName: <b>Redirect Web</b> }}
                    >
                        {'{appName} is a powerful browser extension to redirect URLs based on your custom rules.'}
                    </Translate>
                </p>
                <div className="margin-vert--lg">
                    <ExtensionStoreLinks />
                </div>
                <Heading as='h4'>
                    <Translate
                        id="landingPage.demoVideoPrompt"
                        description="Landing page demo video prompt">
                        👇️ Click to Watch Demo
                    </Translate>
                </Heading>
                <div className={styles.heroVideoContainer}>
                    <video
                        className={styles.heroVideo}
                        src={useBaseUrl('/videos/landing-demo.mov')}
                        controls
                        playsInline
                        preload="metadata"
                        aria-label="Demo video"
                    >
                        Your browser does not support the video tag. You can
                        <a href={useBaseUrl('/videos/landing-demo.mov')} target="_blank" rel="noreferrer">
                            download the video
                        </a>.
                    </video>
                </div>
            </div>
        </header>
    );
}

const useCases = [
    {
        title: 'Custom Default Search Engine',
        description: 'Set Kagi, Startpage, ChatGPT, or any other search engine as your default.'
    },
    {
        title: 'View Reddit in its classic design',
        description: 'Automatically redirect from www.reddit.com to old.reddit.com.'
    },
    {
        title: 'Open Apple Maps from Google Maps links',
        description: 'Prefer Apple Maps? Redirect any Google Maps URL to open in Apple Maps.'
    },
    {
        title: 'Declutter Google Search',
        description: 'Automatically add "?udm=14" to your Google searches to hide AI Overviews.'
    },
    {
        title: 'Use Your Favorite Wiki',
        description: 'Jump from Fandom pages to the official Terraria or Minecraft wikis.'
    },
    {
        title: 'Open Links in Native Apps',
        description: 'Open Figma, Notion, or Google Meet links directly in their desktop apps on your Mac.'
    }
] satisfies { title: string; description: string }[]

function UseCasesSection(): ReactNode {
    return (
        <section className={styles.useCases}>
            <div className="container">
                <Heading as="h2" className="margin-bottom--lg">Example Use Cases</Heading>
                <div className="row">
                    {useCases.map((useCase, idx) => (
                        <div key={idx} className={clsx('col col--4', styles.useCase)}>
                            <div className='card'>
                                <div className="card__header">
                                    <Heading as="h3">{useCase.title}</Heading>
                                </div>
                                <div className="card__body">
                                    <p>{useCase.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="text--center margin-bottom--lg">
                    <p>
                        <b>⭐️
                            <Translate
                                id="general.protipLabel"
                                description="Label for a protip">
                                Protip
                            </Translate>
                        </b>:
                        <Translate
                            id="landingPage.useCasesLibraryFootnote"
                            description="A protip about use cases about the Library section on the landing page">
                            You can get rules of all these use cases from the Library section in the app!
                        </Translate>
                    </p>
                </div>
            </div>
        </section>
    )
}


export default function Home(): ReactNode {
    const { siteConfig } = useDocusaurusContext();
    return (
        <div className='index-page'>
            <Layout
                title={siteConfig.tagline}
                description="A browser extension that redirects all page loads in your browser, ensuring you always land where you want.">
                <HomepageHeader />
                <main>
                    <Award
                        header={
                            <span>Featured by</span>
                        }
                        main={
                            <span><AppleLogo style={{ width: '20px', height: 'auto', verticalAlign: 'text-bottom' }} /> Apple</span>
                        }
                        footer={
                            <span>The best Safari extension</span>
                        }
                    />
                    <HomepageFeatures />
                    <UseCasesSection />
                    <div className="margin-bottom--xl">
                        <ExtensionStoreLinks />
                    </div>
                    <div className="text--center margin-vert--xl">
                        <Link
                            className="button button--primary button--lg"
                            to="/introduction">
                            <Translate
                                id="general.learnMoreAction"
                                description="'Learn More' button">
                                Learn More
                            </Translate>
                        </Link>
                    </div>
                    <div className='text--center margin-bottom--xl'>
                        <h4>
                            <Translate
                                id="landingPage.noAdsNoTracking"
                                description="Landing page tagline about no ads and no tracking">
                                No ads. No tracking. Enjoy a faster, cleaner web tailored to you.
                            </Translate>
                        </h4>
                    </div>
                </main>
            </Layout>
        </div>
    );
}
