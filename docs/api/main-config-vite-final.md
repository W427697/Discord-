---
title: 'viteFinal'
---

Parent: [main.js|ts configuration](./Overview.md)

Type: `(config: Vite.InlineConfig, options: Options) => Vite.InlineConfig | Promise<Vite.InlineConfig>`

Customize Storybook's Vite setup when using the [vite builder](../builders/vite.md).

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-vite-builder-config-env.js.mdx',
    'common/storybook-vite-builder-config-env.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

## `Options`

<!-- TODO: Is it alright to reference `babel`'s Options here? -->

See [`babel` options](./main-config-babel.md#options).
