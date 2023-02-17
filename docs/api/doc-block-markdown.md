---
title: 'Markdown'
---

The `Markdown` block allows you to import and include plain markdown in your MDX files.

![Screenshot of Markdown block](TK)

<!-- prettier-ignore-start -->
```md
// DON'T do this, will error
import ReadMe from './README.md';
// DO this, will work
import ReadMe from './README.md?raw';

import { Markdown } from '@storybook/blocks';

# A header 

<Markdown>{ReadMe}</Markdown />
```
<!-- prettier-ignore-end -->

## API

### Markdown

```js
import { Markdown } from '@storybook/blocks';
```

`Markdown` is a React component which accepts props of type `MarkdownProps`.

#### `MarkdownProps`

##### `children`

Type: `string`

Provides the markdown-formatted string to parse and display.

##### `options`

Specifies the options passed to the underlying [`markdown-to-jsx` library](https://github.com/probablyup/markdown-to-jsx/blob/main/README.md).

## Why not import markdown directly?

From a purely technical standpoint, we could include the imported markdown directly in the MDX file like this:

<!-- prettier-ignore-start -->
```md
{/* THIS WON'T WORK, THIS IS TO DEMONSTRATE AN ERROR */}

import ReadMe from './README.md';

# A header 

{ReadMe}
```
<!-- prettier-ignore-end -->

However there are small syntactical differences between plain Markdown and MDX2. MDX2 is more strict and will interpret certain content as JSX expressions. Here’s an example of a perfectly valid Markdown file, that would break if it was handled directly by MDX2:

<!-- prettier-ignore-start -->
```md
# A header

{ this is valid in a plain Markdown file, but MDX2 will try to evaluate this as an expression }

<This is also valid, but MDX2 thinks this is a JSX component />
```
<!-- prettier-ignore-end -->

Furthermore MDX2 wraps all strings on newlines in `p` tags or similar, meaning that content would render different between a plain .md file and an .mdx file.

<!-- prettier-ignore-start -->
```md
# A header

<div>
  Some text
</div>

The example above will remain as-is in plain Markdown, but MDX2 will compile it to:

# A header

<div>
  <p>Some text</p>
</div>
```
<!-- prettier-ignore-end -->
