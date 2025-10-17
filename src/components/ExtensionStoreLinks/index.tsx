import Link from '@docusaurus/Link';
import { ComponentType, SVGProps } from 'react';
import ChromeStoreBadge from '@site/static/img/chrome-store-badge.svg';
import FirefoxStoreBadge from '@site/static/img/firefox-store-badge.svg';
import AppStoreBadge from '@site/static/img/appstore-badge.svg';
import MicrosoftEdgeStoreBadge from '@site/static/img/microsoft-store-badge.svg';
import { ALL_BROWSERS, BrowserName, ExtensionStoreDetails as BaseExtensionStoreDetails, getExtensionStore as getBaseExtensionStore } from './constants';
import useBaseUrl from '@docusaurus/useBaseUrl';

export { BrowserName, ALL_BROWSERS };

export interface ExtensionStoreDetails extends BaseExtensionStoreDetails {
    badgePath: string;
}

export default function ExtensionStoreLinks() {
    const badgeHeight = '60px';

    return (
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
            {ALL_BROWSERS.map((browserName) => {
                const storeDetails = getExtensionStore({ browserName });
                return (
                    <Link key={browserName} href={storeDetails.extensionPageUrl}>
                        <img src={useBaseUrl(storeDetails.badgePath)} style={{ height: badgeHeight, width: '100%' }} alt={`${browserName} Store Badge`} />
                    </Link>
                );
            })}
        </div>
    );
}

export function getExtensionStore({ browserName }: { browserName: BrowserName }): ExtensionStoreDetails {
    const baseDetails = getBaseExtensionStore({ browserName });
    let badgePath: string;

    switch (browserName) {
        case BrowserName.Chrome:
            badgePath = "/img/chrome-store-badge.svg";
            break;
        case BrowserName.Firefox:
            badgePath = "/img/firefox-store-badge.svg";
            break;
        case BrowserName.Safari:
            badgePath = "/img/appstore-badge.svg";
            break;
        case BrowserName.Edge:
            badgePath = "/img/microsoft-store-badge.svg";
            break;
        default:
            badgePath = "/img/chrome-store-badge.svg";
    }

    return {
        ...baseDetails,
        badgePath
    } satisfies ExtensionStoreDetails;
}
