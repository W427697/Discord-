---
title: 'Story layout'
---

The `layout`[global parameter](../writing-stories/parameters.md) is a way to configure how stories are rendered in Storybook's UI. 

You can add the parameter [`./storybook/preview.js`](./overview.md#configure-story-rendering), like so:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-preview-layout-param.js.mdx'
  ]}
/>

<!-- prettier-ignore-end -->

Here all stories will be centered, once you start Storybook. But other options are available as well, you can also use:

- `fullscreen`, to emulate a fullscreen environment.
- `padded`, for some extra padding.


If you need to use your own styles, or use a more granular approach we recommend using [decorators](../writing-stories/decorators.md) instead.