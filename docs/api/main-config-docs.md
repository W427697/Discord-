---
title: 'config.docs'
---

Type:

```ts
{
  autodocs?: boolean | 'tag';
  defaultName?: string;
  docsMode?: boolean;
}
```

Configures Storybook's [auto-generated documentation](../writing-docs/autodocs.md).

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/main-config-docs.js.mdx',
    'common/main-config-docs.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

## `config.docs.autoDocs`

Type: `boolean | 'tag'`

Default: `'tag'`

Enables or disables automatic documentation for stories.

- `true`: Enables it for all stories
- `false`: Disables it for all stories
- `'tag'`: Enables it for stories tagged with `'autodocs'`

## `config.docs.defaultName`

Type: `string`

Default: `'Docs'`

Name used for generated documentation pages.

## `config.docs.docsMode`

Type: `boolean`

Only show documentation pages in the sidebar (usually set with the `--docs` CLI flag).
