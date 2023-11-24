---
title: 'Compiler support'
---

## SWC

<!-- adjust wording for upgrading -->

SWC is a fast, highly extensible tooling for compiling and bundling modern JavaScript applications. Powered by [Rust](), it provides something something. Storybook provides an integrated experience with SWC, including zero-configuration setup and built-in types for APIs. If you've initialized Storybook in a Webpack-based project with any of the supported [frameworks](./frameworks.md) except Angular it will automatically use SWC as the default, providing you with with faster loading times and improved performance. However, if you want to opt-out of SWC, you can do so by adjusting your Storybook configuration file (i.e., `.storybook/main.js|ts`) as follows:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/main-config-framework-options-builder-use-swc.js.mdx',
    'common/main-config-framework-options-builder-use-swc.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

## Babel

Babel is a JavaScript compiler widely used in modern frontend development to help

###

## Troubleshooting

<IfRenderer renderer='react'>

###

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/main-config-swc-jsx-transform.js.mdx',
    'common/main-config-swc-jsx-transform.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

</IfRenderer>
