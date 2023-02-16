---
title: 'Typeset'
---

The `Typeset` block helps document the fonts used throughout your project.

![Screenshot of Typeset block](./doc-block-typeset-optimized.png)<!-- TK -->

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/typeset-doc.block.mdx.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

## API

### Typeset

```js
import { Typeset } from '@storybook/blocks';
```

`Typeset` is a React component which accepts props of type `TypesetProps`.

#### `TypesetProps`

##### `fontFamily`

Type: `string`

Provides a font family to be displayed.

##### `fontSizes`

Type: `number[]`

Provides a list of available font sizes (in `px`).

##### `fontWeight`

Type: `number`

Specifies the weight of the font to be displayed.

##### `sampleText`

Type: `string`

Sets the text to be displayed.
