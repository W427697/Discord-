---
title: 'Controls'
---

The `Controls` block can be used to show a dynamic table of args for a given story, as a way to document its interface, and to allow you to change the args for a (separately) rendered story (via the [`Story`](./doc-block-story.md) or [`Canvas`](./doc-block-canvas.md) blocks).

<div class="aside">

💡 If you’re looking for a static table that shows a component's arg types with no controls, see the [`ArgTypes`](./doc-block-argtypes.md) block instead.

</div>

![Screenshot of Controls block](TK)

<!-- prettier-ignore-start -->
```md
{/* ButtonDocs.mdx */}
import { Canvas, Controls } from '@storybook/blocks';
import * as ButtonStories from './Button.stories'

<Canvas of={ButtonStories.Primary} />

<Controls of={ButtonStories.Primary} />
```
<!-- prettier-ignore-end -->

## API

### Controls

```js
import { Controls } from '@storybook/blocks';
```

`Controls` is a React component which accepts props of type `ControlsProps`.

<div class="aside">

ℹ️ Like most blocks, the `Controls` block can both be configured via props when using it directly in MDX, or with properties in `parameters.docs.controls`.

</div>

#### `ControlsProps`

##### `exclude`

Type: `string[] | RegExp`

Specifies which args to exclude from table. Any args whose name matches the regex or is part of the array will be left out.

##### `include`

Type: `string[] | RegExp`

Specifies which args to include in the table. Any args whose name doesn’t match the regex or is not part of the array will be left out.

##### `of`

Type: Story export

Specifies which story to get the args from.

##### `sort`

Type: `'none' | 'alpha' | 'requiredFirst'`

Default: `'none'`

Specifies how the controls are sorted.

- **none**: Unsorted, displayed in the same order the args are processed in
- **alpha**: Sorted alphabetically, by the arg's name
- **requiredFirst**: Same as `alpha`, with any required args displayed first
