import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    "introduction",
    "getting-started",
    "rule-settings",
    "library",
    "export-or-import-rules",
    {
      type: 'category',
      label: 'Q&A',
      items: [
        "contact-us",
        "faq",
      ],
    },
    {
      type: 'category',
      label: 'Misc.',
      items: [
        "release-notes",
        "privacy-policy",
        "terms-of-use",
      ]
    }
  ],
};

export default sidebars;
