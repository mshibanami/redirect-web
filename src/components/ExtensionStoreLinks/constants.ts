export enum BrowserName {
    Chrome = 'Chrome',
    Firefox = 'Firefox',
    Safari = 'Safari',
    Edge = 'Edge'
}

export interface ExtensionStoreDetails {
    storeName: string;
    extensionPageUrl: string;
}

export const ALL_BROWSERS: BrowserName[] = [
    BrowserName.Safari,
    BrowserName.Chrome,
    BrowserName.Firefox,
    BrowserName.Edge
];

export function getExtensionStore({ browserName }: { browserName: BrowserName }): ExtensionStoreDetails {
    switch (browserName) {
        case BrowserName.Chrome:
            return {
                storeName: 'Chrome Web Store',
                extensionPageUrl: 'https://chromewebstore.google.com/detail/ffglckbhfbfmdkefdmjbhpnffkcmlhdh'
            };
        case BrowserName.Firefox:
            return {
                storeName: 'Firefox Add-ons',
                extensionPageUrl: 'https://addons.mozilla.org/firefox/addon/redirect-web/',
            };
        case BrowserName.Safari:
            return {
                storeName: 'App Store',
                extensionPageUrl: 'https://apps.apple.com/app/id1571283503'
            };
        case BrowserName.Edge:
            return {
                storeName: 'Microsoft Edge Add-ons',
                extensionPageUrl: 'https://microsoftedge.microsoft.com/addons/detail/hmfkakfdccgdpgemaicfgngnmflefpga'
            };
        default:
            return getExtensionStore({ browserName: BrowserName.Chrome });
    }
}
