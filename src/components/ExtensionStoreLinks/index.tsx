import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Bowser from 'bowser';
import { ComponentType, DetailedHTMLProps, ImgHTMLAttributes, SVGProps, useEffect, useState } from 'react';
import AppStoreBadge from '@site/static/img/appstore-badge.svg';
import ChromeStoreBadge from '@site/static/img/chrome-store-badge.svg';
import FirefoxStoreBadge from '@site/static/img/firefox-store-badge.svg';
import MicrosoftEdgeStoreBadge from '@site/static/img/microsoft-store-badge.svg';


export default function ExtensionStoreLinks() {
    const [storeDetails, setStoreDetails] = useState<ExtensionStoreDetails | undefined>();

    useEffect(() => {
        const parser = Bowser.getParser(window.navigator.userAgent);
        const browser = parser.getBrowser();
        const normalizedBrowserName = normalizeBrowserName(browser.name);
        const extensionStore = getExtensionStore({ browserName: normalizedBrowserName });
        setStoreDetails(extensionStore);
    }, []);

    const safariStoreDetails = getExtensionStore({ browserName: BrowserName.Safari });

    return (
        <div style={{ display: 'flex', gap: '10px' }}>
            {
                storeDetails && (
                    <Link href={storeDetails.extensionPageUrl}>
                        <storeDetails.badge />
                    </Link>
                )
            }
            {
                storeDetails && storeDetails.storeName != safariStoreDetails.storeName ? (
                    <Link href={safariStoreDetails.extensionPageUrl}>
                        <safariStoreDetails.badge />
                    </Link>
                ) : null
            }
        </div>
    );
}

function normalizeBrowserName(browserName?: string): BrowserName {
    if (!browserName) {
        return BrowserName.Chrome;
    }
    const name = browserName.toLowerCase();
    if (name.includes('chrome')) {
        return BrowserName.Chrome;
    } else if (name.includes('firefox')) {
        return BrowserName.Firefox;
    } else if (name.includes('safari')) {
        return BrowserName.Safari;
    } else if (name.includes('edge')) {
        return BrowserName.Edge;
    }
    return BrowserName.Chrome;
}

function getExtensionStore({ browserName }: { browserName: BrowserName }): ExtensionStoreDetails {
    switch (browserName) {
        case BrowserName.Chrome:
            return {
                storeName: 'Chrome Web Store',
                badge: ChromeStoreBadge,
                extensionPageUrl: 'https://chromewebstore.google.com/detail/ffglckbhfbfmdkefdmjbhpnffkcmlhdh'
            };
        case BrowserName.Firefox:
            return {
                storeName: 'Firefox Add-ons',
                badge: FirefoxStoreBadge,
                extensionPageUrl: 'https://addons.mozilla.org/firefox/addon/redirect-web/',
            };
        case BrowserName.Safari:
            return {
                storeName: 'App Store',
                badge: AppStoreBadge,
                extensionPageUrl: 'https://apps.apple.com/app/id1571283503'
            };
        case BrowserName.Edge:
            return {
                storeName: 'Microsoft Edge Add-ons',
                badge: MicrosoftEdgeStoreBadge,
                extensionPageUrl: 'https://microsoftedge.microsoft.com/addons/detail/hmfkakfdccgdpgemaicfgngnmflefpga'
            };
        default:
            return getExtensionStore({ browserName: BrowserName.Chrome });
    }
}

interface ExtensionStoreDetails {
    storeName: string;
    extensionPageUrl: string;
    badge: ComponentType<SVGProps<SVGSVGElement>>;
}

enum BrowserName {
    Chrome = 'Chrome',
    Firefox = 'Firefox',
    Safari = 'Safari',
    Edge = 'Edge'
}
