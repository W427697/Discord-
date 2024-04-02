---
title: 'tags'
hideRendererSelector: true
---

Parent: [main.js|ts configuration](./main-config.md)

Type: `{ [key: string]: { description?: string } }`

[Tags](../writing-stories/tags.md) allow you to control which stories are included in your Storybook. They are defined in the `tags` property of the Storybook configuration. Then they can be [applied to stories](../writing-stories/tags.md#tagging-stories) at the project, component, and story levels using the `tags` array.

## Default tags

The following tags are available by default in your project:

```js
{
  dev: { description: 'Rendered in the Storybook UI, but only in development mode. They do not appear in the sidebar in production mode.' },
  docs: { description: 'Rendered in the Storybook UI, but only in the docs page. They do not appear in the sidebar.' },
  test: { description: 'Not rendered in the Storybook UI, in either development or production mode.' },
}
```

## Custom tags

You can [define your own tags](../writing-stories/tags.md#custom-tags). When doing so, the key is the tag name, and the value is an object with an optional `description` property.

```ts
// .storybook/main.ts
import { StorybookConfig } from '@storybook/<your-framework>';

const config: StorybookConfig = {
  // ...rest of config
  tags: {
    experimental: { description: 'Stories for experimental components or features' },
  },
};

export default config;
```
