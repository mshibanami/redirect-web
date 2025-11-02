import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import ExtensionStoreLinks from '@site/src/components/ExtensionStoreLinks';
import LandingPageBackground from '@site/src/components/LandingPageBackground';
import Image from "@site/src/components/Image";
import AwardSection from '@site/src/components/AwardSection';
import FeaturesSection from '@site/src/components/FeaturesSection';
import LearnMoreSection from '@site/src/components/LearnMoreSection';
import TaglineSection from '@site/src/components/TaglineSection';
import UseCasesSection from '@site/src/components/UseCasesSection';
import styles from './index.module.scss';
import Translate, { translate } from '@docusaurus/Translate';
import Head from '@docusaurus/Head';

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

export default function Home(): ReactNode {
    const { siteConfig } = useDocusaurusContext();
    const headerAnimation = useScrollAnimation();
    const awardAnimation = useScrollAnimation();
    const featuresAnimation = useScrollAnimation();
    const useCasesAnimation = useScrollAnimation();
    const learnMoreAnimation = useScrollAnimation();
    const taglineAnimation = useScrollAnimation();
    const titleDescription = translate({
        id: "landingPage.metadataTitleDescription",
        description: "Short description of the app for the landing page metadata",
        message: "A Browser Extension to Auto-Redirect Pages You Specify"
    })
    const appName = siteConfig.title;
    const title = `${appName} – ${titleDescription}`;
    const description = translate(
        {
            id: "landingPage.heroSubtitle",
            description: "Landing page hero subtitle",
            message: '{appName} is a powerful browser extension to redirect URLs based on your custom rules.'
        },
        { appName }
    );

    return (
        <div className='index-page'>
            <Layout
                title={title}
                description={description}>
                <main>
                    <LandingPageBackground style={{ height: "600px", width: "100%" }} />
                    <div ref={headerAnimation.ref} className={clsx(styles.animatedSection, {
                        [styles.visible]: headerAnimation.isVisible
                    })}>
                        <HomepageHeader />
                    </div>
                    <div
                        ref={awardAnimation.ref}
                        className={clsx(styles.animatedSection, {
                            [styles.visible]: awardAnimation.isVisible
                        })}>
                        <AwardSection />
                    </div>

                    <div
                        ref={featuresAnimation.ref}
                        className={clsx(styles.animatedSection, {
                            [styles.visible]: featuresAnimation.isVisible
                        })}>
                        <FeaturesSection />
                    </div>

                    <UseCasesSection
                        animationRef={useCasesAnimation.ref}
                        isVisible={useCasesAnimation.isVisible}
                    />

                    <div
                        ref={learnMoreAnimation.ref}
                        className={clsx(styles.animatedSection, {
                            [styles.visible]: learnMoreAnimation.isVisible
                        })}>
                        <LearnMoreSection />
                    </div>

                    <div
                        ref={taglineAnimation.ref}
                        className={clsx(styles.animatedSection, {
                            [styles.visible]: taglineAnimation.isVisible
                        })}>
                        <TaglineSection />
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
