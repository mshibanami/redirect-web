import Bowser from 'bowser';
import { ReactNode, useEffect, useState } from "react";

export default function IfBrowserStore({ stores, includes, children }: IfBrowserProps) {
    const normalizedStores = Array.isArray(stores) ? stores : [stores];

    const [currentBrowserStore, setCurrentBrowserStore] = useState<BrowserStoreType | undefined>();

    useEffect(() => {
        const parser = Bowser.getParser(window.navigator.userAgent);
        const browser = parser.getBrowser();
        const extensionStore = getStoreType({ browserName: browser.name ?? BrowserType.chrome });
        setCurrentBrowserStore(extensionStore);
    }, []);

    const isIncluded = !!normalizedStores.find(store => store === currentBrowserStore);
    if (isIncluded === (includes ?? true)) {
        return <>{children}</>;
    } else {
        return null;
    }
}

interface IfBrowserProps {
    stores?: BrowserStoreType[] | BrowserStoreType;
    includes?: boolean;
    children: ReactNode;
};

const normalizedBrowserName = (browserName?: string): BrowserType => {
    if (!browserName) {
        return defaultBrowserName;
    }
    const name = browserName.toLowerCase();
    if (name.includes('chrome')) {
        return BrowserType.chrome;
    } else if (name.includes('firefox')) {
        return BrowserType.firefox;
    } else if (name.includes('safari')) {
        return BrowserType.safari;
    } else if (name.includes('edge')) {
        return BrowserType.edge;
    } else {
        return defaultBrowserName;
    }
}

const getStoreType = ({ browserName }: { browserName: string }): BrowserStoreType | undefined => {
    const normalizedName = normalizedBrowserName(browserName);
    switch (normalizedName) {
        case BrowserType.chrome:
            return BrowserStoreType.chromeWebStore;
        case BrowserType.firefox:
            return BrowserStoreType.firefoxAddons;
        case BrowserType.safari:
            return BrowserStoreType.appStore;
        case BrowserType.edge:
            return BrowserStoreType.microsoftEdgeStore;
        default:
            return undefined;
    }
}

enum BrowserStoreType {
    chromeWebStore = 'chromeWebStore',
    firefoxAddons = 'firefoxAddons',
    appStore = 'appStore',
    microsoftEdgeStore = 'microsoftEdgeStore'
}

const BrowserType = {
    chrome: 'chrome',
    firefox: 'firefox',
    safari: 'safari',
    edge: 'edge'
} as const;

type BrowserType = typeof BrowserType[keyof typeof BrowserType];

const defaultBrowserName: BrowserType = BrowserType.chrome;
