import fs from 'fs';
import fg from 'fast-glob';
import { Config, Plugin } from "@docusaurus/types";

export default function docusaurusPluginBuildRedirection(): Plugin {
    return {
        name: 'docusaurus-plugin-build-redirection',

        async postBuild({ siteConfig, outDir }: { siteConfig: Config; outDir: string }) {
            const redirectionBaseUrl = siteConfig.customFields?.redirectionBaseUrl as string | undefined;
            if (!redirectionBaseUrl) {
                return;
            }
            const targetBase = redirectionBaseUrl.replace(/\/+$/, '');

            console.log(`[Redirection] Overwriting built files for redirection to: ${targetBase}`);

            const files = await fg(['**/index.html', '404.html'], { cwd: outDir, absolute: true });

            for (const file of files) {
                const relativePath = file.replace(outDir, '');
                let urlPath = relativePath
                    .replace(/index\.html$/, '');
                const normalizedUrl = `${targetBase}/${urlPath}`
                    .replace(/([^:]\/)\/+/g, '$1');
                const redirectHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="robots" content="noindex, nofollow">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="refresh" content="0;url=${normalizedUrl}">
<title>Redirecting...</title>
<link rel="canonical" href="${normalizedUrl}">
<script>
(function() {
    window.location.replace("${normalizedUrl}" + window.location.search + window.location.hash);
})();
</script>
</head>
<body>
<p>Redirecting to <a href="${normalizedUrl}">${normalizedUrl}</a>...</p>
<noscript>
<p><strong>JavaScript is disabled.</strong> Please click <a href="${normalizedUrl}">here</a> to continue.</p>
</noscript>
</body>
</html>`;
                await fs.promises.writeFile(file, redirectHtml);
            }
            console.log(`[Redirection] Overwrote ${files.length} HTML files.`);
        }
    };
}
