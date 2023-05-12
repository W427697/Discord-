---
title: 'config.refs'
---

Type:

```ts
{ [key: string]:
  | { title: string; url: string; expanded?: boolean }
  | { disable: boolean }
}
```

Configures [Storybook composition](../sharing/storybook-composition.md).

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-main-ref-remote.js.mdx',
    'common/storybook-main-ref-remote.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

## Disable a ref

Some package dependencies automatically [compose their Storybook in yours](../sharing/package-composition.md). You can disable this behavior by setting `disable` to `true` for the package name:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-main-disable-refs.js.mdx',
    'common/storybook-main-disable-refs.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->
