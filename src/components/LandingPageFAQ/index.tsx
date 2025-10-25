import type { ReactNode } from 'react';
import { useState } from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import Translate, { translate } from '@docusaurus/Translate';
import Link from '@docusaurus/Link';
import styles from './styles.module.scss';

interface FAQItem {
    question: string;
    answer: ReactNode;
}

const faqItems: FAQItem[] = [
    {
        question: translate({
            id: 'landingPageFAQ.otherApps.question',
            message: 'There are other similar extensions. How is Redirect Web different?',
            description: 'FAQ question about other apps'
        }),
        answer: (
            <div>
                <p>
                    <Translate
                        id="landingPageFAQ.otherApps.answer"
                        description="FAQ answer about other apps"
                    >
                        {'Redirect Web offers unique features like detailed rule settings, useful rule library, iCloud Sync, Safari support, and more. But each tool has its own advantages. Check our comparison page to help you choose the one that best fits your needs:'}
                    </Translate>
                    {" "}
                    <Link to="/vs-other-tools">
                        <b>
                            <Translate
                                id="landingPageFAQ.otherApps.comparisonLink"
                                description="FAQ answer link to comparison page"
                            >
                                Comparison with Other Tools
                            </Translate>
                        </b>
                    </Link>
                </p>
            </div>
        )
    },
    {
        question: translate({
            id: 'landingPageFAQ.whichPlanIsBest.question',
            message: 'One-time purchase or annual subscription: which is best?',
            description: 'FAQ question about purchasing'
        }),
        answer: (
            <p>
                <Translate
                    id="landingPageFAQ.whichPlanIsBest.answer"
                    description="FAQ answer about purchasing">
                    We recommend the one-time purchase, as the price difference is small. The main reason we offer the subscription is to allow you to try all the features through its free trial.
                </Translate>
            </p>
        )
    },
    {
        question: translate({
            id: 'landingPageFAQ.appRequired.question',
            message: 'Should I get the native app after installing the browser extension?',
            description: 'FAQ question about app requirement'
        }),
        answer: (
            <p>
                <Translate
                    id="landingPageFAQ.appRequired.answer"
                    description="FAQ answer about app requirement">
                    Yes. You need to download the Redirect Web app from the App Store regardless of which browser you use.
                    The app is required to manage your rules.
                </Translate>
            </p>
        )
    },
    {
        question: translate({
            id: 'landingPageFAQ.library.question',
            message: 'Will the library become paid in the future?',
            description: 'FAQ question about library pricing'
        }),
        answer: (
            <p>
                <Translate
                    id="landingPageFAQ.library.answer"
                    description="FAQ answer about library pricing">
                    No, it's always free and open source. You can find the source of all the contents on GitHub.
                </Translate>
                {" "}
                <Link href='https://github.com/mshibanami/redirect-web/tree/main/library/rule-sets'>
                    <b>
                        <Translate
                            id="landingPageFAQ.library.completeListOfLibraryRules"
                            description="FAQ answer link to complete list of library rules">
                            Complete list of Library Rules
                        </Translate>
                    </b>
                </Link>
            </p>
        )
    },
    {
        question: translate({
            id: 'landingPageFAQ.platforms.question',
            message: 'Does it work on Windows, Android, or Linux?',
            description: 'FAQ question about platform support'
        }),
        answer: (
            <p>
                <Translate
                    id="landingPageFAQ.platforms.answer"
                    description="FAQ answer about platform support">
                    Not at this time. Currently, Redirect Web only works on Mac, iPhone, iPad, and Apple Vision Pro.
                </Translate>
            </p>
        )
    },
    {
        question: translate({
            id: 'landingPageFAQ.ads.question',
            message: 'Does it inject ads or tracking into websites?',
            description: 'FAQ question about ads and tracking'
        }),
        answer: (
            <p>
                <Translate
                    id="landingPageFAQ.ads.answer"
                    description="FAQ answer about ads and tracking">
                    No, it never injects anything like that. No ads, no tracking, no unrelated content.
                </Translate>
            </p>
        )
    },
    {
        question: translate({
            id: 'landingPageFAQ.ownership.question',
            message: 'Could Redirect Web ever be sold to someone else?',
            description: 'FAQ question about ownership transfer'
        }),
        answer: (
            <p>
                <Translate
                    id="landingPageFAQ.ownership.answer"
                    description="FAQ answer about ownership transfer">
                    100% no. Browser extensions have deep control over your browsing and data.
                    Redirect Web will always remain in our hands, so you can browse with complete confidence.
                </Translate>
            </p>
        )
    }
];

interface FAQAccordionItemProps {
    item: FAQItem;
    isOpen: boolean;
    onClick: () => void;
}

function FAQAccordionItem({ item, isOpen, onClick }: FAQAccordionItemProps): ReactNode {
    return (
        <div className={clsx(styles.faqItem, { [styles.open]: isOpen })}>
            <button
                className={styles.faqQuestion}
                onClick={onClick}
                aria-expanded={isOpen}
            >
                <span className={styles.questionText}>{item.question}</span>
                <svg
                    className={styles.icon}
                    aria-hidden="true"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M6 9L12 15L18 9"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>
            <div className={clsx(styles.faqAnswer, { [styles.show]: isOpen })}>
                <div className={styles.answerWrapper}>
                    <div className={styles.answerContent}>
                        {item.answer}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function LandingPageFAQ(): ReactNode {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleItem = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className={styles.faqSection}>
            <div className="container">
                <div className={styles.faqHeader}>
                    <Heading as="h2">
                        <Translate
                            id="landingPageFAQ.title"
                            description="FAQ section title">
                            Frequently Asked Questions
                        </Translate>
                    </Heading>
                </div>
                <div className={styles.faqContainer}>
                    {faqItems.map((item, index) => (
                        <FAQAccordionItem
                            key={index}
                            item={item}
                            isOpen={openIndex === index}
                            onClick={() => toggleItem(index)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
