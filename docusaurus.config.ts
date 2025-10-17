import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import remarkGithubAdmonitionsToDirectives from "remark-github-admonitions-to-directives";
import remarkCjkFriendly from 'remark-cjk-friendly';
import { ALL_BROWSERS, getExtensionStore } from './src/components/ExtensionStoreLinks/constants';

const locale = process.env.DOCUSAURUS_CURRENT_LOCALE;
const projectName = 'redirect-web';
const baseUrl = `/${projectName}/`;

const config: Config = {
  title: 'Redirect Web',
  tagline: translatedTagline(locale),
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
          routeBasePath: '',
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
        { to: '/introduction', label: 'Docs', position: 'left', activeBaseRegex: `^/${projectName}/docs/?.*` },
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
              to: '/introduction',
            },
            {
              label: 'How to Create Rules',
              to: '/category/how-to-create-rules',
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
              to: '/faq',
            },
            {
              label: 'Contact Us',
              to: '/contact-us',
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
              to: "/privacy-policy",
            },
            {
              label: "Terms of Use",
              to: "/terms-of-use",
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

function translatedTagline(locale): string {
  switch (locale) {
    case 'bg':
      return 'Оптимизирайте уеб изживяването си';
    case 'cs':
      return 'Zefektivněte svůj webový zážitek';
    case 'da':
      return 'Strømlin din weboplevelse';
    case 'de':
      return 'Optimieren Sie Ihr Weberlebnis';
    case 'el':
      return 'Βελτιστοποιήστε την εμπειρία σας στο διαδίκτυο';
    case 'es':
      return 'Optimiza tu experiencia web';
    case 'et':
      return 'Muuda oma veebikogemus sujuvamaks';
    case 'fi':
      return 'Tehosta verkkokokemustasi';
    case 'fr':
      return 'Optimisez votre expérience web';
    case 'hu':
      return 'Tegye gördülékenyebbé a webes élményét';
    case 'id':
      return 'Permudah pengalaman web Anda';
    case 'it':
      return 'Ottimizza la tua esperienza web';
    case 'ja':
      return 'ウェブ体験をもっとスムーズに';
    case 'ko':
      return '웹 경험을 간소화하세요';
    case 'lt':
      return 'Supaprastinkite savo žiniatinklio patirtį';
    case 'lv':
      return 'Vienkāršojiet savu tīmekļa pieredzi';
    case 'nl':
      return 'Stroomlijn uw webervaring';
    case 'pl':
      return 'Usprawnij swoje doświadczenie w sieci';
    case 'pt-br':
      return 'Otimize sua experiência na web';
    case 'pt-pt':
      return 'Otimize a sua experiência na web';
    case 'ro':
      return 'Optimizați experiența dvs. pe web';
    case 'ru':
      return 'Оптимизируйте ваш веб‑опыт';
    case 'sk':
      return 'Zefektívnite svoj webový zážitok';
    case 'sl':
      return 'Poenostavite svojo spletno izkušnjo';
    case 'sv':
      return 'Förenkla din webbupplevelse';
    case 'tr':
      return 'Web deneyiminizi kolaylaştırın';
    case 'uk':
      return 'Оптимізуйте свій веб‑досвід';
    case 'zh-hans':
      return '优化您的网页体验';
    default:
      return 'Streamline Your Web Experience';
  }
}
