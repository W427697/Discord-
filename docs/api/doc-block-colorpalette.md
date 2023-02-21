---
title: 'ColorPalette'
---

The `ColorPalette` block allows you to document all color-related items (e.g., swatches) used throughout your project.

![Screenshot of ColorPalette and ColorItem blocks](./doc-block-colorpalette-optimized.png)<!-- TK -->

<!-- prettier-ignore-start -->

<!--TK-->
<CodeSnippets
  paths={[
    'common/colorpalette-doc-block.starter-example.mdx.mdx',
    'common/colopalette-doc-block.advanced-example.mdx.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

## ColorPalette

```js
import { ColorPalette } from '@storybook/blocks';
```

`ColorPalette` is configured with the following props:

### `children`

Type: `React.ReactNode`

`ColorPalette` expects only `ColorItem` children.

## ColorItem

```js
import { ColorItem } from '@storybook/blocks';
```

`ColorItem` is configured with the following props:

### `colors` (required)

Type: `string[] | { [key: string]: string }`

Provides the list of colors to be displayed. Accepts any valid CSS color format (hex, RGB, HSL, etc.). When an object is provided, the keys will be displayed above the values.

### `subtitle` (required)

Type: `string`

Provides an additional description of the color.

### `title` (required)

Type: `string`

Sets the name of the color to be displayed.
