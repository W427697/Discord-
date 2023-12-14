---
title: addons
navOrder: 4
navGroup:
  title: main.js|ts configuration
  order: 1
---

Parent: [main.js|ts configuration](./main-config.md)

Type: `(string | { name: string; options?: AddonOptions })[]`

Registers the [addons](../07-addons/install-addons.md) loaded by Storybook.

For each addon's available options, see their respective [documentation](https://storybook.js.org/integrations).

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/main-config-addons.js.mdx',
    'common/main-config-addons.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->
