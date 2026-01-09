import { useEffect, type ReactNode } from 'react';
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

    useEffect(() => {
        if (typeof window !== 'undefined' && redirectionBaseUrl) {
            const basePath = siteConfig.baseUrl || '/';
            const currentPath = window.location.pathname;
            const normalizedPath = (
                currentPath.startsWith(basePath)
                    ? currentPath.slice(basePath.length - 1)
                    : currentPath
            );
            const targetBase = redirectionBaseUrl.replace(/\/+$/, '');
            const redirectUrl = `${targetBase}${normalizedPath}${window.location.search}${window.location.hash}`;
            window.location.replace(redirectUrl);
        }
    }, [redirectionBaseUrl, siteConfig.baseUrl]);

    if (typeof window !== 'undefined' && redirectionBaseUrl) {
        return <p>Redirecting...</p>;
    }
    return <>{children}</>;
}
