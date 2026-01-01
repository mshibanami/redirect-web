import type { ReactNode } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

interface Props {
    children: ReactNode;
}

/**
 * Root component that wraps the entire Docusaurus application.
 * When REDIRECTION_BASE_URL is set, redirects all pages to that URL
 * while preserving the current path.
 *
 * Example:
 * - /introduction → https://redirectweb.net/introduction
 * - /ja/introduction → https://redirectweb.net/ja/introduction
 */
export default function Root({ children }: Props): ReactNode {
    const { siteConfig } = useDocusaurusContext();
    const redirectionBaseUrl = siteConfig.customFields?.redirectionBaseUrl as string | undefined;
    if (typeof window !== 'undefined' && redirectionBaseUrl) {
        const currentPath = window.location.pathname;
        const currentSearch = window.location.search;
        const currentHash = window.location.hash;
        const redirectUrl = `${redirectionBaseUrl}${currentPath}${currentSearch}${currentHash}`;
        window.location.replace(redirectUrl);
        return (<p>Redirecting to <a href={redirectUrl}>{redirectUrl}</a>...</p>);
    }
    return <>{children}</>;
}
