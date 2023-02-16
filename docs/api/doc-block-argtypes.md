---
title: 'ArgTypes'
---

The `ArgTypes` block can be used to show a static table of [arg types](./argtypes.md) for a given component, as a way to document its interface.

<div class="aside">

💡 If you’re looking for a dynamic table that shows a story’s current arg values for a story and supports users changing them, see the [`Controls`](./doc-block-controls.md) block instead.

</div>

![Screenshot of ArgTypes block](TK)

<!-- prettier-ignore-start -->
```md
{/* ButtonDocs.mdx */}
import { ArgTypes } from '@storybook/blocks';
import * as ButtonStories from './Button.stories';

<ArgTypes of={ButtonStories} />;
```
<!-- prettier-ignore-end -->

## API

### ArgTypes

```js
import { ArgTypes } from '@storybook/blocks';
```

`ArgTypes` is a React component which accepts props of type `ArgTypesProps`.

<div class="aside">

ℹ️ Like most blocks, the `ArgTypes` block can both be configured via props when using it directly in MDX, or with properties in `parameters.docs.argTypes`.

</div>

#### `ArgTypesProps`

##### `exclude`

Type: `string[] | RegExp`

Specifies which arg types to exclude from table. Any arg types whose name matches the regex or is part of the array will be left out.

##### `include`

Type: `string[] | RegExp`

Specifies which arg types to include in the table. Any arg types whose name doesn’t match the regex or is not part of the array will be left out.

##### `of`

Type: Story export or CSF file exports

Specifies which story to get the arg types from. If a CSF file exports is provided, it will use the primary (first) story in the file.

##### `sort`

Type: `'none' | 'alpha' | 'requiredFirst'`

Default: `'none'`

Specifies how the arg types are sorted.

- **none**: Unsorted, displayed in the same order the arg types are processed in
- **alpha**: Sorted alphabetically, by the arg type's name
- **requiredFirst**: Same as `alpha`, with any required arg types displayed first
