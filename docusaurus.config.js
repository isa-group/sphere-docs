// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from "prism-react-renderer";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

const currentVersion = "2.0.1";

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "SPHERE",
  tagline: "A new way to manage your SaaS pricing",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://sphere-docs.vercel.app",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "isa-group", // Usually your GitHub org/user name.
  projectName: "SPHERE", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  customFields: {
    currentVersion: currentVersion,
    spaceOasUrl: "https://raw.githubusercontent.com/Alex-GF/space/refs/heads/main/api/docs/space-api-docs.yaml",
    githubUrl: "https://github.com/Alex-GF/sphere"
  },

  themes: ["@docusaurus/theme-mermaid"],
  markdown: {
    mermaid: true,
  },

  stylesheets: [
    {
      href: "https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css",
      type: "text/css",
      integrity:
        "sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM",
      crossorigin: "anonymous",
    },
  ],

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: "./sidebars.js",
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
          lastVersion: "current",
          versions: {
            current: {
              label: currentVersion,
              path: currentVersion,
            },
          },
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: "img/docusaurus-social-card.jpg",
      navbar: {
        title: "SPHERE",
        logo: {
          alt: "SPHERE Logo",
          src: "img/logo.png",
        },
        items: [
          {
            type: "docSidebar",
            sidebarId: "docsSidebar",
            position: "left",
            label: "Getting Started",
          },
          {
            type: "docSidebar",
            sidebarId: "apiSidebar",
            position: "left",
            label: "Developer Guide",
          },
          {
            type: "docSidebar",
            sidebarId: "contribSidebar",
            position: "left",
            label: "Contributing",
          },
          {
            type: "docSidebar",
            sidebarId: "commonErrorsSidebar",
            position: "left",
            label: "FAQs",
          },
          {
            type: "docsVersionDropdown",
            position: "right",
            dropdownActiveClassDisabled: true,
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Documentation",
            items: [
              {
                label: "Getting Started",
                to: `/docs/${currentVersion}/docs/introduction`,
              },
              {
                label: "Developer Guide",
                to: `/docs/${currentVersion}/api/introduction`,
              },
              {
                label: "Contributing",
                to: `/docs/${currentVersion}/contrib/introduction`,
              },
              {
                label: "FAQs",
                to: `/docs/${currentVersion}/commonErrors/introduction`,
              },
            ],
          },
          {
            title: "GitHub Repositories",
            items: [
              {
                label: "Pricing4Java",
                href: "https://github.com/isa-group/Pricing4Java",
              },
              {
                label: "Pricing4React",
                href: "https://github.com/isa-group/Pricing4React",
              },
              {
                label: "Pricing4TS",
                href: "https://github.com/Alex-GF/Pricing4TS",
              },
              {
                label: "SaaS analysis",
                href: "https://github.com/isa-group/SaaS-analysis",
              },
            ],
          },
          {
            title: "Contribute",
            items: [
              {
                label: "Docs",
                href: "https://github.com/isa-group/sphere-docs",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} ISA Group, Universidad de Sevilla.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ["java", "typescript", "diff", "bash"],
      },
      algolia: {
        // The application ID provided by Algolia
        appId: "J0N8S0XNCM",

        // Public API key: it is safe to commit it
        apiKey: "4d11978c3b3698b0da87e4088f483293",

        indexName: "pricing4saas-vercel",

        // Optional: see doc section below
        contextualSearch: false,

        // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
        // externalUrlRegex: 'external\\.com|domain\\.com',

        // Optional: Replace parts of the item URLs from Algolia. Useful when using the same search index for multiple deployments using a different baseUrl. You can use regexp or string in the `from` param. For example: localhost:3000 vs myCompany.com/docs
        // replaceSearchResultPathname: {
        //   from: '/docs/', // or as RegExp: /\/docs\//
        //   to: '/',
        // },

        // Optional: Algolia search parameters
        // searchParameters: {},

        // Optional: path for search page that enabled by default (`false` to disable it)
        // searchPagePath: 'search',

        //... other Algolia params
      },
    }),
};

export default config;
