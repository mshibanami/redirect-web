import type { ReactNode } from 'react';
import Translate from '@docusaurus/Translate';

export default function TaglineSection(): ReactNode {
    return (
        <section className='text--center'>
            <h2>
                <Translate
                    id="landingPage.noAdsNoTracking"
                    description="Landing page tagline about no ads and no tracking">
                    No ads. No tracking. Enjoy a faster, cleaner web tailored to you.
                </Translate>
            </h2>
        </section>
    );
}
