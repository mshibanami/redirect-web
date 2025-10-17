import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import remarkGithubAdmonitionsToDirectives from "remark-github-admonitions-to-directives";
import remarkCjkFriendly from 'remark-cjk-friendly';
import { ALL_BROWSERS, getExtensionStore } from './src/components/ExtensionStoreLinks/constants';
import { translate } from '@docusaurus/Translate';

const projectName = 'redirect-web';
const baseUrl = `/${projectName}/`;

const config: Config = {
  title: 'Redirect Web',
  tagline: translate({
    id: 'tagline',
    description: 'A tagline of the app',
    message: 'Take Control of Your Web Experience'
  }),
  url: 'https://mshibanami.github.io/',
  baseUrl: baseUrl,
  organizationName: 'mshibanami',
  projectName: projectName,
  onBrokenLinks: 'throw',
  i18n: {
    defaultLocale: 'en',
    locales: ["bg", "cs", "da", "de", "el", "es", "en", "et", "fi", "fr", "hu", "id", "it", "ja", "ko", "lt", "lv", "nl", "pl", "pt-br", "pt-pt", "ro", "ru", "sk", "sl", "sv", "tr", "uk", "zh-hans"],
  },
  plugins: [
    'docusaurus-plugin-sass'
  ],
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    }
  },
  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/docs',
          sidebarPath: './sidebars.ts',
          sidebarCollapsible: false,
          sidebarCollapsed: false,
          remarkPlugins: [remarkCjkFriendly],
          beforeDefaultRemarkPlugins: [remarkGithubAdmonitionsToDirectives],
        },
        blog: {
          path: 'release-notes',
          routeBasePath: '/release-notes',
          blogSidebarTitle: 'Release Notes',
          blogTitle: 'Release Notes',
          blogSidebarCount: 'ALL',
          blogDescription: 'Release notes for Redirect Web.',
          blogListComponent: '@site/src/components/ReleaseNotesList',
          showReadingTime: false,
          feedOptions: {
            type: ['rss', 'atom', 'json'],
            title: 'Redirect Web Release Notes',
            description: 'An RSS feed of changelogs for Redirect Web',
            language: 'en',
          },
          onUntruncatedBlogPosts: 'ignore',
          remarkPlugins: [remarkCjkFriendly],
        },
        theme: {
          customCss: './src/css/custom.scss',
        },
      } satisfies Preset.Options,
    ],
  ],
  themeConfig: {
    // Replace with your project's social card
    image: 'img/social-card.jpg',
    colorMode: {
      disableSwitch: true,
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Redirect Web',
      logo: {
        alt: 'Redirect Web logo',
        src: 'img/logo.png',
      },
      hideOnScroll: true,
      items: [
        { to: '/docs', label: 'Docs', position: 'left', activeBaseRegex: `^/${projectName}/docs/?.*` },
        { to: '/release-notes', label: 'Release Notes', position: 'left', activeBaseRegex: `^/${projectName}/release-notes/?.*` },
        {
          type: 'html',
          position: 'right',
          value: `<a href="https://apps.apple.com/app/id1571283503" class="navbar__appstore_button navbar__item_force"><img src="${baseUrl}img/appstore-badge.svg" alt="Go to Apple Store" /></a>`,
          className: "navbar__item_force"
        },
        {
          type: 'localeDropdown',
          position: 'right',
          className: "navbar__item_force"
        },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `<a class="footer__link-item" href="https://mshibanami.github.io/">© Manabu Nakazawa</a>`,
      links: [
        {
          title: 'Download',
          items:
            ALL_BROWSERS.map((name) => {
              const storeDetails = getExtensionStore({ browserName: name });
              return {
                label: storeDetails.storeName,
                href: storeDetails.extensionPageUrl,
              };
            })
        },
        {
          title: 'Docs',
          items: [
            {
              label: 'Introduction',
              to: '/docs',
            },
            {
              label: 'How to Create Rules',
              to: '/docs/category/how-to-create-rules',
            },
            {
              label: 'Release Notes',
              to: '/release-notes',
            },
          ]
        },
        {
          title: 'Help',
          items: [
            {
              label: "Forums (GitHub)",
              href: "https://github.com/mshibanami/redirect-web/discussions",
            },
            {
              label: 'FAQ',
              to: '/docs/faq',
            },
            {
              label: 'Contact Us',
              to: '/docs/contact-us',
            }
          ]
        },
        {
          title: 'Social',
          items: [
            {
              label: "GitHub",
              href: "https://github.com/mshibanami/redirect-web/",
            },
            {
              label: "LinkedIn",
              href: "https://www.linkedin.com/company/redirect-web",
            }
          ]
        },
        {
          title: "Legal",
          items: [
            {
              label: "Privacy Policy",
              to: "/docs/privacy-policy",
            },
            {
              label: "Terms of Use",
              to: "/docs/terms-of-use",
            },
          ]
        }
      ]
    },
    prism: {
      theme: {
        ...prismThemes.github,
        plain: {
          ...prismThemes.github.plain,
          backgroundColor: '#eaecf0',
        },
      },
      darkTheme: {
        ...prismThemes.dracula,
        plain: {
          ...prismThemes.dracula.plain,
          backgroundColor: '#2d3b4e',
        },
      },
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
