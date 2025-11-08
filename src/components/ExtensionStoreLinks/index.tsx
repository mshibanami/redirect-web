import Link from '@docusaurus/Link';
import { ALL_BROWSERS, BrowserName, getExtensionStore } from './constants';
import useBaseUrl from '@docusaurus/useBaseUrl';

export { BrowserName, ALL_BROWSERS };

export default function ExtensionStoreLinks(
    { justifyContent = "center" }: { justifyContent?: React.CSSProperties['justifyContent'] }
) {
    return (
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent, flexWrap: 'wrap' }}>
            {ALL_BROWSERS.map((browserName) => {
                const storeDetails = getExtensionStore({ browserName });
                return (
                    <Link key={browserName} href={storeDetails.extensionPageUrl}>
                        <img src={useBaseUrl(storeDetails.badgePath)}
                            style={{ height: '60px', width: '100%' }}
                            alt={`${browserName} Store Badge`} />
                    </Link>
                );
            })}
        </div>
    );
}
