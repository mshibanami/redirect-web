import Link from '@docusaurus/Link';
import { ComponentType, SVGProps } from 'react';
import AppStoreBadge from '@site/static/img/appstore-badge.svg';
import ChromeStoreBadge from '@site/static/img/chrome-store-badge.svg';
import FirefoxStoreBadge from '@site/static/img/firefox-store-badge.svg';
import MicrosoftEdgeStoreBadge from '@site/static/img/microsoft-store-badge.svg';
import { ALL_BROWSERS, BrowserName, ExtensionStoreDetails as BaseExtensionStoreDetails, getExtensionStore as getBaseExtensionStore } from './constants';

export { BrowserName, ALL_BROWSERS };

export interface ExtensionStoreDetails extends BaseExtensionStoreDetails {
    badge: ComponentType<SVGProps<SVGSVGElement>>;
}

export default function ExtensionStoreLinks() {
    const badgeHeight = '60px';

    return (
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
            {ALL_BROWSERS.map((browserName) => {
                const storeDetails = getExtensionStore({ browserName });
                return (
                    <Link key={browserName} href={storeDetails.extensionPageUrl}>
                        <storeDetails.badge style={{ height: badgeHeight, width: '100%' }} />
                    </Link>
                );
            })}
        </div>
    );
}

export function getExtensionStore({ browserName }: { browserName: BrowserName }): ExtensionStoreDetails {
    const baseDetails = getBaseExtensionStore({ browserName });
    let badge: ComponentType<SVGProps<SVGSVGElement>>;
    
    switch (browserName) {
        case BrowserName.Chrome:
            badge = ChromeStoreBadge;
            break;
        case BrowserName.Firefox:
            badge = FirefoxStoreBadge;
            break;
        case BrowserName.Safari:
            badge = AppStoreBadge;
            break;
        case BrowserName.Edge:
            badge = MicrosoftEdgeStoreBadge;
            break;
        default:
            badge = ChromeStoreBadge;
    }
    
    return {
        ...baseDetails,
        badge
    };
}
