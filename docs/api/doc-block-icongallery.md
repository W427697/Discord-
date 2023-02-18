---
title: 'IconGallery'
---

The `IconGallery` block enables you to easily document all icons associated with your project, displayed in a neat grid.

![Screenshot of IconGallery and IconItem blocks](./doc-block-icon-gallery-optimized.png)<!-- TK -->

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/icongallery-doc-block.mdx.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

## IconGallery

```js
import { IconGallery } from '@storybook/blocks';
```

`IconGallery` is configured with the following props:

### `children`

Type: `React.ReactNode`

`IconGallery` expects only `IconItem` children.

## IconItem

```js
import { IconItem } from '@storybook/blocks';
```

`IconItem` is configured with the following props:

### `children`

Type: `React.ReactNode`

Provides the icon to be displayed.

### `name` (required)

Type: `string`

Sets the name of the icon.
