import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';
import ExtensionStoreLinks from '@site/src/components/ExtensionStoreLinks';
import LandingPageFAQ from '@site/src/components/landing/LandingPageFAQ';
import Translate from '@docusaurus/Translate';

export default function LearnMoreSection(): ReactNode {
    return (
        <section>
            <LandingPageFAQ />
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
        </section>
    );
}
