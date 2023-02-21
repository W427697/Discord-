---
title: 'Typeset'
---

The `Typeset` block helps document the fonts used throughout your project.

![Screenshot of Typeset block](./doc-block-typeset-optimized.png)<!-- TK -->

<!-- prettier-ignore-start -->

<!--TK-->
<CodeSnippets
  paths={[
    'common/typeset-doc.block.mdx.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

## Typeset

```js
import { Typeset } from '@storybook/blocks';
```

`Typeset` is configured with the following props:

### `fontFamily`

Type: `string`

Provides a font family to be displayed.

### `fontSizes`

Type: `number[]`

Provides a list of available font sizes (in `px`).

### `fontWeight`

Type: `number`

Specifies the weight of the font to be displayed.

### `sampleText`

Type: `string`

Sets the text to be displayed.
