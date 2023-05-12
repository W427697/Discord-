---
title: 'config.staticDirs'
---

Type: `(string | { from: string; to: string })[]`

Sets a list of directories of [static files](../configure/images-and-assets.md#serving-static-files-via-storybook-configuration) to be loaded by Storybook.

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-main-with-multiple-static-dir.js.mdx',
    'common/storybook-main-with-multiple-static-dir.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

## With configuration objects

You can also use a configuration object to define the directories:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-main-with-object-configuration-static-dir.js.mdx',
    'common/storybook-main-with-object-configuration-static-dir.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->
