---
title: previewHead
navOrder: 17
navGroup:
  title: main.js|ts configuration
  order: 1
---

Parent: [main.js|ts configuration](./main-config.md)

Type: `(head: string) => string`

Programmatically adjust the [preview `<head>`](../08-configure/story-rendering.md#adding-to-head) of your Storybook. Most often used by [addon authors](../07-addons/writing-presets.md#ui-configuration).

<Callout variant="info" icon="💡">

If you don't need to programmatically adjust the preview head, you can add scripts and styles to [`preview-head.html`](../08-configure/story-rendering.md#adding-to-head) instead.

</Callout>

For example, you can conditionally add scripts or styles, depending on the environment:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/main-config-preview-head.js.mdx',
    'common/main-config-preview-head.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->
