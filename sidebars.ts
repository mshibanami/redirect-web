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
    {
      type: "category",
      label: "How to Create Rules",
      link: {
        type: 'generated-index',
        description: `Common use cases for creating rules in the Redirect Web app. (You can also learn the details of rule settings on the [Rule Settings](./rule-settings) page.)`,
        slug: '/category/how-to-create-rules',
      },
      items: [
        "tutorial-redirect-to-another-website",
        "tutorial-remove-query-params",
        "tutorial-add-query-params",
      ],
    },
    "rule-settings",
    "library",
    "export-or-import-rules",
    {
      type: 'category',
      label: 'Help',
      items: [
        "faq",
        "contact-us",
      ],
    },
    {
      type: 'category',
      label: 'Misc.',
      items: [
        {
          type: 'link',
          label: 'Release Notes',
          href: '/release-notes',
        },
        "privacy-policy",
        "terms-of-use",
      ]
    }
  ],
};

export default sidebars;
