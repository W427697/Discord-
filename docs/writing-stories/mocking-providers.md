---
title: Mocking providers
---

<!-- TODO: React & Solid only? -->

## Providers

Components can receive data or configuration from context providers. For example, a styled component might access its theme from a ThemeProvider. To mock a provider, you can wrap your component in a [decorator](./decorators.md) that includes the necessary context.

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'react/storybook-preview-with-styled-components-decorator.js.mdx',
    'react/storybook-preview-with-styled-components-decorator.ts.mdx',
    'solid/storybook-preview-with-styled-components-decorator.js.mdx',
    'solid/storybook-preview-with-styled-components-decorator.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

TK: Something about the `context` argument?
