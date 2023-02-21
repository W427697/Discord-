---
title: Doc blocks
---

Storybook offers a number of doc blocks to help document your components and other aspects of your project.

The blocks are most commonly used within Storybook's [MDX documentation](./mdx.md):

![Screenshot of mdx content](TK)

<!-- prettier-ignore-start -->
```md
{/* ButtonDocs.mdx */}

import { Meta, Primary, Controls, Story } from '@storybook/blocks';
import * as ButtonStories from './Button.stories';

<Meta of={ButtonStories} />

# Button

A button is ...

<Primary />

## Props

<Controls />

## Stories

### Primary

Button can be primary-colored

<Story of={ButtonStories.Primary} />

Button can be secondary-colored

<Story of={ButtonStories.Secondary} />

{/* ... */}
```
<!-- prettier-ignore-end -->

The blocks are also used in the default template for [automatics docs](./docs-page.md#setup-automated-documentation):

![Screenshot of automatic docs template](TK)

```jsx
import { Title, Subtitle, Description, Primary, Controls, Stories } from '@storybook/blocks';

export const autoDocsTemplate = () => (
  <>
    <Title />
    <Subtitle />
    <Description />
    <Primary />
    <Controls />
    <Stories />
  </>
);
```

That template will show the primary (i.e. first) story for the component, a table documenting (and allowing you to control) the arg types of the primary story, and a list of all the stories in a condensed format.

## Available blocks

For a description and API details of each block, see the API reference:

- [`ArgTypes`](../api/doc-block-argtypes.md)
- [`Canvas`](../api/doc-block-canvas.md)
- [`ColorPalette`](../api/doc-block-colorpalette.md)
- [`Controls`](../api/doc-block-controls.md)
- [`Description`](../api/doc-block-description.md)
- [`IconGallery`](../api/doc-block-icongallery.md)
- [`Markdown`](../api/doc-block-markdown.md)
- [`Meta`](../api/doc-block-meta.md)
- [`Primary`](../api/doc-block-primary.md)
- [`Source`](../api/doc-block-source.md)
- [`Stories`](../api/doc-block-stories.md)
- [`Story`](../api/doc-block-story.md)
- [`Subtitle`](../api/doc-block-subtitle.md)
- [`Title`](../api/doc-block-title.md)
- [`Typeset`](../api/doc-block-typeset.md)
- [`Unstyled`](../api/doc-block-unstyled.md)

## Make your own doc blocks

Storybook also provides a [`useOf` hook](../api/doc-block-useof.md) to make it easier to create your own blocks that function in the same manner as the built-in blocks.
