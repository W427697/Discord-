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

## Controls

```js
import { Controls } from '@storybook/blocks';
```

<details>
<summary>Configuring with props <strong>and</strong> parameters</summary>

ℹ️ Like most blocks, the `ArgTypes` block is configured with props in MDX. Many of those props derive their default value from a corresponding [parameter](../writing-stories/parameters.md) in the block's namespace, `parameters.docs.argTypes`.

The following `include` configurations are equivalent:

```js
// Button.stories.js
export default {
  component: Button,
  parameters: {
    docs: {
      argTypes: { include: 'color' },
    },
  },
};
```

<!-- prettier-ignore-start -->
```md
{/* ButtonDocs.mdx */}
<ArgTypes of={ButtonStories} include="color" />
```
<!-- prettier-ignore-end -->

The example above applied the parameter at the [component](../writing-stories/parameters.md#component-parameters) (or meta) level, but it could also be applied at the [project](../writing-stories/parameters.md#global-parameters) or [story](../writing-stories/parameters.md#story-parameters) level.

</details>

### `exclude`

Type: `string[] | RegExp`

Default: `parameters.docs.controls.exclude`

Specifies which controls to exclude from table. Any controls whose name matches the regex or is part of the array will be left out.

### `include`

Type: `string[] | RegExp`

Default: `parameters.docs.controls.include`

Specifies which controls to include in the table. Any controls whose name doesn’t match the regex or is not part of the array will be left out.

### `of`

Type: Story export or CSF file exports

Specifies which story to get the controls from. If a CSF file exports is provided, it will use the primary (first) story in the file.

### `sort`

Type: `'none' | 'alpha' | 'requiredFirst'`

Default: `parameters.docs.controls.sort` or `'none'`

Specifies how the controls are sorted.

- **none**: Unsorted, displayed in the same order the controls are processed in
- **alpha**: Sorted alphabetically, by the arg type's name
- **requiredFirst**: Same as `alpha`, with any required controls displayed first
