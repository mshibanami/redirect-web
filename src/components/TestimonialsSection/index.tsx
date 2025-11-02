import type { ReactNode, RefObject } from 'react';
import { useState } from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import Translate, { translate } from '@docusaurus/Translate';
import styles from './styles.module.scss';
import enCode from '../../../i18n/en/code.json'
import frCode from '../../../i18n/fr/code.json'
import ruCode from '../../../i18n/ru/code.json'

interface Testimonial {
    name: string;
    affiliation?: string;
    review: string;
    originalReview?: string;
    originalLanguage: string;
    avatar?: string;
}

const appStoreAffiliation = 'App Store';

const testimonials: Testimonial[] = [
    {
        name: 'Aliuskonte',
        affiliation: '🇷🇺 ' + appStoreAffiliation + ' ･ Mac',
        review: translate({
            id: 'testimonials.userReview.aliuskonte',
            message: 'Все работает. Управление редиректами интуитивно понятное, настройка занимает минимальное количество времени. И стоимость вполне демократичная. Рекомендую',
            description: 'Testimonial review by a user'
        }),
        originalReview: ruCode['testimonials.userReview.aliuskonte'].message,
        originalLanguage: 'ru'
    },
    {
        name: '=== World 1 ===',
        affiliation: '🇨🇦 ' + appStoreAffiliation + ' ･ iOS',
        review: translate({
            id: 'testimonials.userReview.world1',
            message: 'Works as intended and it’s very fast! Allows almost unlimited customization with the paid plan which is very affordable (thanks for making a lifetime plan!)',
            description: 'Testimonial review by a user'
        }),
        originalReview: enCode['testimonials.userReview.world1'].message,
        originalLanguage: 'en'
    },
    {
        name: 'Juliewlwwlw',
        affiliation: '🇵🇱 ' + appStoreAffiliation + ' ･ iOS',
        review: translate({
            id: 'testimonials.userReview.juliewlwwlw',
            message: 'Nice, very nice. Does the job of 10 other extensions with more flexibility. Very future proof. Sleek UI, good price. Must buy for anyone into privacy redirects.',
            description: 'Testimonial review by a user'
        }),
        originalReview: enCode['testimonials.userReview.juliewlwwlw'].message,
        originalLanguage: 'en'
    },
    {
        name: 'kieran_hunt',
        affiliation: '🇮🇪 ' + appStoreAffiliation + ' ･ iOS',
        review: translate({
            id: 'testimonials.userReview.kieranHunt',
            message: 'I needed an app to help curb my internet addiction. Every time my muscle memory takes me to YouTube, Hacker News or Twitter, I’ve set Redirect Web to send me to a site filled with stoic quotes. That’s enough of a kick in the behind to stop me wanting to mindlessly browse.',
            description: 'Testimonial review by a user'
        }),
        originalReview: enCode['testimonials.userReview.kieranHunt'].message,
        originalLanguage: 'en'
    },
    {
        name: 'Phearlez',
        affiliation: '🇺🇸 ' + appStoreAffiliation + ' ･ Mac',
        review: translate({
            id: 'testimonials.userReview.phearlez',
            message: "This app removes a minor but constant annoyance in my life and I LOVE IT. My work requires me to click on Google Meet links that are sent to me in Mail and Slack but they don't have a great experience in Safari - my default browser - so I have to right click, copy, open Chrome, paste, then go. Except when I forget and then it's a whole different pain. Not any more, though. One quick rule setup to grab any matching URL and open it in Chrome and boom, now I can just click and not have to remember. I'm sure there will be more to come, what with places like my bank and some airlines having sites that don't work well in Safari. I'd rather just use Safari all the time but I can't control what those places do. Now I can at least control how much headache they cause me. Hooray for this app!",
            description: 'Testimonial review by a user'
        }),
        originalReview: enCode['testimonials.userReview.phearlez'].message,
        originalLanguage: 'en'
    },
    {
        name: 'iAbcdaire',
        affiliation: '🇫🇷 ' + appStoreAffiliation + ' ･ iOS',
        review: translate({
            id: 'testimonials.userReview.iAbcdaire',
            message: 'Meilleur application pour rediriger les liens et sites web vers la destination que vous aurez choisi. Et plus performant que les autres, redirige même les liens bloqués par votre bloqueur de contenu ou votre pare-feu.',
            description: 'Testimonial review by a user'
        }),
        originalReview: frCode['testimonials.userReview.iAbcdaire'].message,
        originalLanguage: 'fr'
    }
];

interface TestimonialCardProps {
    testimonial: Testimonial;
    currentLocale: string;
}

function getLanguageName(languageCode: string, currentLocale: string): string {
    const languageNames = new Intl.DisplayNames([currentLocale], { type: 'language' });
    return languageNames.of(languageCode) || languageCode;
}

function TestimonialCard({ testimonial, currentLocale }: TestimonialCardProps): ReactNode {
    const [showOriginal, setShowOriginal] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const maxReviewTextLength = 200;

    const hasOriginal = testimonial.originalReview &&
        testimonial.originalLanguage &&
        testimonial.originalLanguage !== currentLocale;

    const displayReview = showOriginal && hasOriginal ? testimonial.originalReview : testimonial.review;
    const shouldTruncate = displayReview.length > maxReviewTextLength;
    const truncatedReview = shouldTruncate && !isExpanded
        ? displayReview.slice(0, maxReviewTextLength)
        : displayReview;

    return (
        <div className={clsx('col col--4', styles.testimonialCol)}>
            <div className={'card'}>
                <div className="card__body">
                    <div className={styles.stars}>
                        {[...Array(5)].map((_, i) => (
                            <span key={i} className={styles.star}>★</span>
                        ))}
                    </div>
                    <p className={styles.reviewText}>
                        <span
                            className={shouldTruncate && !isExpanded ? styles.truncatedText : ''}
                            onClick={() => shouldTruncate && !isExpanded && setIsExpanded(true)}
                            style={{ cursor: 'text' }}
                        >
                            {truncatedReview}
                        </span>
                        {shouldTruncate && !isExpanded && (
                            <>
                                <span className={styles.ellipsis}>...</span>
                                <span
                                    className={styles.moreButton}
                                    onClick={() => setIsExpanded(true)}
                                >
                                    more
                                </span>
                            </>
                        )}
                    </p>
                    {hasOriginal && (
                        <div className={styles.translationInfo}>
                            {!showOriginal && (
                                <span className={styles.translatedFrom}>
                                    <Translate
                                        id="testimonials.translatedFrom"
                                        description="Text showing the original language"
                                        values={{ language: getLanguageName(testimonial.originalLanguage, currentLocale) }}
                                    >
                                        {'Translated from {language}'}
                                    </Translate>
                                </span>
                            )}
                            <button
                                className={styles.originalButton}
                                onClick={() => {
                                    setShowOriginal(!showOriginal);
                                    setIsExpanded(true);
                                }}
                            >
                                {showOriginal ? (
                                    <Translate
                                        id="testimonials.showTranslation"
                                        description="Button to show translation">
                                        Show Translation
                                    </Translate>
                                ) : (
                                    <Translate
                                        id="testimonials.showOriginal"
                                        description="Button to see original review">
                                        Show Original
                                    </Translate>
                                )}
                            </button>
                        </div>
                    )}
                </div>
                <div className={clsx('card__footer', styles.cardFooter)}>
                    <div className={styles.userInfo}>
                        {testimonial.avatar && (
                            <img
                                src={testimonial.avatar}
                                alt={testimonial.name}
                                className={styles.avatar}
                            />
                        )}
                        <div>
                            <div>{testimonial.name}</div>
                            {testimonial.affiliation && (
                                <span className={styles.userAffiliation}>{testimonial.affiliation}</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

interface TestimonialsSectionProps {
    animationRef: RefObject<HTMLDivElement>;
    isVisible: boolean;
}

export default function TestimonialsSection({ animationRef, isVisible }: TestimonialsSectionProps): ReactNode {
    const currentLocale = typeof window !== 'undefined'
        ? document.documentElement.lang
        : 'en';

    return (
        <section
            ref={animationRef}
            className={clsx(styles.testimonials, styles.animatedSection, {
                [styles.visible]: isVisible
            })}>
            <div className="container">
                <Heading as="h2" className={clsx('text--center', styles.sectionTitle)}>
                    <Translate
                        id="landingPage.testimonials.title"
                        description="Title for the testimonials section">
                        Loved by Users Worldwide
                    </Translate>
                </Heading>
                <div className="row">
                    {testimonials.map((testimonial, idx) => (
                        <TestimonialCard
                            key={idx}
                            testimonial={testimonial}
                            currentLocale={currentLocale}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
