---
title: webpackFinal
navOrder: 23
navGroup:
  title: main.js|ts configuration
  order: 1
---

Parent: [main.js|ts configuration](./main-config.md)

Type: `async (config: Config, options: WebpackOptions) => Config`

Customize Storybook's Webpack setup when using the [webpack builder](../09-builders/webpack.md).

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/main-config-webpack-final.js.mdx',
    'common/main-config-webpack-final.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

## `Options`

Type: `{ configType?: 'DEVELOPMENT' | 'PRODUCTION' }`

There are other options that are difficult to document here. Please introspect the type definition for more information.
