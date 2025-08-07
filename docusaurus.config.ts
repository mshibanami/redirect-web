import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import remarkGithubAdmonitionsToDirectives from "remark-github-admonitions-to-directives";

const projectName = 'redirect-web';

const config: Config = {
  title: 'Redirect Web',
  tagline: 'Redirect any website',
  url: 'https://mshibanami.github.io/',
  baseUrl: `/${projectName}/`,
  organizationName: 'mshibanami',
  projectName: projectName,
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          sidebarCollapsible: false,
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
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],
  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Redirect Web',
      logo: {
        alt: 'Site Logo',
        src: 'img/logo.svg',
      },
      hideOnScroll: true,
      items: [
        { to: '/', label: 'Docs', position: 'left', activeBaseRegex: `^/${projectName}/(?!release-notes).*` },
        { to: '/release-notes', label: 'Release Notes', position: 'left', activeBaseRegex: `^/${projectName}/release-notes/?.*` },
        {
          type: 'html',
          position: 'right',
          value: '<a href="https://apps.apple.com/app/id1571283503" class="navbar__appstore_button navbar__item_force"><img src="img/appstore-badge.svg" alt="Apple Logo" /></a>',
          className: "navbar__item_force"
        },
        {
          href: 'https://github.com/mshibanami/redirect-web',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `© ${new Date().getFullYear()} Manabu Nakazawa`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
