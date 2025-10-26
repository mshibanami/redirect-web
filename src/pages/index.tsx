import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
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
import Translate, { translate } from '@docusaurus/Translate';
import Head from '@docusaurus/Head';
import LandingPageFAQ from '@site/src/components/LandingPageFAQ';

function HomepageHeader() {
    const { siteConfig } = useDocusaurusContext();
    return (
        <header className={clsx('hero', styles.heroBanner)}>
            <div className={clsx("container", styles.heroContainer)}>
                <Image
                    src={useBaseUrl('/img/logo.png')}
                    alt="Redirect Web Logo"
                    width={100}
                    height={100}
                    margin='80px 0' />

                <Heading as="h1" className="hero__title">
                    {siteConfig.tagline}
                </Heading>
                <p className="hero__subtitle margin-bottom--xl">
                    <Translate
                        id="landingPage.heroSubtitle"
                        description="Landing page hero subtitle"
                        values={{ appName: <b>Redirect Web</b> }}
                    >
                        {'{appName} is a powerful browser extension to redirect URLs based on your custom rules.'}
                    </Translate>
                </p>
                <div className="margin-vert--xl">
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
        title: translate({
            id: 'productUseCases.customDefaultSearchEngine.title',
            message: 'Custom Default Search Engine',
            description: 'Use case title for a redirection rules of changing browser\'s default search engine to another search engine'
        }),
        description: translate({
            id: 'productUseCases.customDefaultSearchEngine.description',
            message: 'Set Kagi, Startpage, ChatGPT, or any other search engine as your default.',
            description: 'Use case description for a redirection rules of changing browser\'s default search engine to another search engine'
        })
    },
    {
        title: translate({
            id: 'productUseCases.viewRedditClassic.title',
            message: 'View Reddit in its classic design',
            description: 'Use case title for a redirection rules of viewing Reddit in its classic design'
        }),
        description: translate({
            id: 'productUseCases.viewRedditClassic.description',
            message: 'Automatically redirect from www.reddit.com to old.reddit.com.',
            description: 'Use case description for a redirection rules of viewing Reddit in its classic design'
        })
    },
    {
        title: translate({
            id: 'productUseCases.openAppleMaps.title',
            message: 'Open Apple Maps from Google Maps links',
            description: 'Use case title for a redirection rules of opening Apple Maps from Google Maps links'
        }),
        description: translate({
            id: 'productUseCases.openAppleMaps.description',
            message: 'Prefer Apple Maps? Redirect any Google Maps URL to open in Apple Maps.',
            description: 'Use case description for a redirection rules of opening Apple Maps from Google Maps links'
        })
    },
    {
        title: translate({
            id: 'productUseCases.declutterGoogleSearch.title',
            message: 'Declutter Google Search',
            description: 'Use case title for a redirection rules of decluttering Google Search'
        }),
        description: translate({
            id: 'productUseCases.declutterGoogleSearch.description',
            message: 'Automatically add "?udm=14" to your Google searches to hide AI Overviews.',
            description: 'Use case description for a redirection rules of decluttering Google Search'
        })
    },
    {
        title: translate({
            id: 'productUseCases.useYourFavoriteWiki.title',
            message: 'Use Your Favorite Wiki',
            description: 'Use case title for a redirection rules of jumping from Fandom pages to the official Terraria or Minecraft wikis'
        }),
        description: translate({
            id: 'productUseCases.useYourFavoriteWiki.description',
            message: 'Jump from Fandom pages to the official Terraria or Minecraft wikis.',
            description: 'Use case description for a redirection rules of jumping from Fandom pages to the official Terraria or Minecraft wikis'
        })
    },
    {
        title: translate({
            id: 'productUseCases.openLinksInNativeApps.title',
            message: 'Open Links in Native Apps',
            description: 'Use case title for a redirection rules of opening links in their native apps'
        }),
        description: translate({
            id: 'productUseCases.openLinksInNativeApps.description',
            message: 'Open Figma, Notion, or Google Meet links directly in their desktop apps on your Mac.',
            description: 'Use case description for a redirection rules of opening links in their native apps'
        })
    }
] satisfies { title: string; description: string }[]

function useScrollAnimation() {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -100px 0px'
            }
        );

        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, []);

    return { ref, isVisible };
}

function UseCasesSection(): ReactNode {
    const { ref, isVisible } = useScrollAnimation();

    return (
        <section
            ref={ref}
            className={clsx(styles.useCases, styles.animatedSection, {
                [styles.visible]: isVisible
            })}>
            <div className="container">
                <Heading as="h2" className="margin-bottom--lg">
                    <Translate
                        id="landingPage.exampleUseCases.title"
                        description="Title for the example use cases section">
                        Example Use Cases
                    </Translate>
                </Heading>
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
                                description="Label for a hint">
                                Protip
                            </Translate>
                        </b>: <Translate
                            id="landingPage.useCasesLibraryFootnote"
                            description="A hint about use cases about the Library section on the landing page">
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
    const headerAnimation = useScrollAnimation();
    const awardAnimation = useScrollAnimation();
    const featuresAnimation = useScrollAnimation();
    const learnMoreAnimation = useScrollAnimation();
    const taglineAnimation = useScrollAnimation();
    const title = `Redirect Web - ${siteConfig.tagline}`;
    const description = translate(
        {
            id: "landingPage.heroSubtitle",
            description: "Landing page hero subtitle",
            message: '{appName} is a powerful browser extension to redirect URLs based on your custom rules.'
        },
        { appName: 'Redirect Web' }
    );

    return (
        <div className='index-page'>
            <Layout
                title={title}
                description={description}>
                <LandingPageBackground style={{ height: "600px", width: "100%" }} />
                <div ref={headerAnimation.ref} className={clsx(styles.animatedSection, {
                    [styles.visible]: headerAnimation.isVisible
                })}>
                    <HomepageHeader />
                </div>
                <main>
                    <div
                        ref={awardAnimation.ref}
                        className={clsx(styles.animatedSection, {
                            [styles.visible]: awardAnimation.isVisible
                        })}>
                        <div className='margin-vert--xl'>
                            <Award
                                header={
                                    <span>Featured by</span>
                                }
                                main={
                                    <span><AppleLogo style={{ width: '20px', height: 'auto', verticalAlign: 'text-bottom', paddingBottom: '0.15rem' }} /> Apple</span>
                                }
                                footer={
                                    <span>The best Safari extensions</span>
                                }
                            />
                        </div>
                    </div>
                    <div
                        ref={featuresAnimation.ref}
                        className={clsx(styles.animatedSection, {
                            [styles.visible]: featuresAnimation.isVisible
                        })}>
                        <HomepageFeatures />
                    </div>
                    <UseCasesSection />

                    <div
                        ref={learnMoreAnimation.ref}
                        className={clsx(styles.animatedSection, {
                            [styles.visible]: learnMoreAnimation.isVisible
                        })}>

                        <LandingPageFAQ />
                        <div
                            className="margin-bottom--xl">
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
                    </div>

                    <div
                        ref={taglineAnimation.ref}
                        className={clsx(styles.animatedSection, 'text--center margin-bottom--xl', {
                            [styles.visible]: taglineAnimation.isVisible
                        })}>
                        <h3>
                            <Translate
                                id="landingPage.noAdsNoTracking"
                                description="Landing page tagline about no ads and no tracking">
                                No ads. No tracking. Enjoy a faster, cleaner web tailored to you.
                            </Translate>
                        </h3>
                    </div>
                </main>
            </Layout>

            <Head titleTemplate="%s">
                <title>{title}</title>
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
            </Head>
        </div>
    );
}
