import type { ReactNode } from 'react';
import Translate from '@docusaurus/Translate';

export default function TaglineSection(): ReactNode {
    return (
        <div className='text--center margin-bottom--xl'>
            <h3>
                <Translate
                    id="landingPage.noAdsNoTracking"
                    description="Landing page tagline about no ads and no tracking">
                    No ads. No tracking. Enjoy a faster, cleaner web tailored to you.
                </Translate>
            </h3>
        </div>
    );
}
