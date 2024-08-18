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
    "export-or-import-rules",
    "getting-started",
    "introduction",
    "library",
    "rule-settings",
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
        "privacy-policy",
        "terms-of-use",
      ]
    }
  ],
};

export default sidebars;