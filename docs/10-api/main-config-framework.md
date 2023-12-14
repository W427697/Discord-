---
title: framework
navOrder: 2
navGroup:
  title: main.js|ts configuration
  order: 1
---

(**Required**)

Parent: [main.js|ts configuration](./main-config.md)

Type: `FrameworkName | { name: FrameworkName; options?: FrameworkOptions }`

Configures Storybook based on a set of [framework-specific](../08-configure/frameworks.md) settings.

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/main-config-framework.js.mdx',
    'common/main-config-framework.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

## `name`

Type: `string`

For available frameworks and their options, see their respective [documentation](https://github.com/storybookjs/storybook/tree/next/code/frameworks).

## `options`

Type: `Record<string, any>`

While many options are specific to a framework, there are some options that are shared across some frameworks, e.g. those that configure Storybook's [builder](./main-config-core.md#builder).

### `options.builder`

Type: `Record<string, any>`

Configures Storybook's builder, [Vite](../09-builders/vite.md) or [Webpack](../09-builders/webpack.md).

#### `options.builder.useSWC`

For frameworks made with [Webpack](../09-builders/webpack.md) builder, except Angular. Enabling this option allows you to use the [SWC](https://swc.rs/) compiler instead of [Babel](../08-configure/compilers.md#babel).

When Storybook loads, it will update Webpack's configuration including the required loaders (e.g., [`TerserPlugin`](https://webpack.js.org/plugins/terser-webpack-plugin/), [`babel-loader`](https://webpack.js.org/loaders/babel-loader/)) with SWC equivalents (e.g., [`swc-loader`](https://swc.rs/docs/usage/swc-loader)) for bundling and minification.

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/main-config-framework-options-builder-use-swc.js.mdx',
    'common/main-config-framework-options-builder-use-swc.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->
