---
title: 'ColorPalette'
---

The `ColorPalette` block allows you to document all color-related items (e.g., swatches) used throughout your project.

![Screenshot of ColorPalette and ColorItem blocks](./doc-block-colorpalette-optimized.png)<!-- TK -->

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/colorpalette-doc-block.starter-example.mdx.mdx',
    'common/colopalette-doc-block.advanced-example.mdx.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

## API

### ColorPalette

```js
import { ColorPalette } from '@storybook/blocks';
```

`ColorPalette` is a React component which accepts props of type `ColorPaletteProps`.

#### `ColorPaletteProps`

##### `children`

Type: `React.ReactNode`

`ColorPalette` expects only `ColorItem` children.

### ColorItem

```js
import { ColorItem } from '@storybook/blocks';
```

`ColorItem` is a React component which accepts props of type `ColorItemProps`.

#### `ColorItemProps`

##### `colors` (required)

Type: `string[] | { [key: string]: string }`

Provides the list of colors to be displayed. Accepts any valid CSS color format (hex, RGB, HSL, etc.). When an object is provided, the keys will be displayed above the values.

##### `subtitle` (required)

Type: `string`

Provides an additional description to the color.

##### `title` (required)

Type: `string`

Sets the name of the color to be displayed.
