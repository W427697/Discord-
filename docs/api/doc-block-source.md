---
title: 'Source'
---

The `Source` block is used to render a snippet of source code directly.

![Screenshot of Source block](TK)

<!-- prettier-ignore-start -->
```md
{/* ButtonDocs.mdx */}
import { Meta, Source } from '@storybook/blocks';
import * as ButtonStories from './Button.stories';

<Meta of={ButtonStories} />

<Source of={ButtonStories.Primary} />
```
<!-- prettier-ignore-end -->

## API

### Source

```js
import { Source } from '@storybook/blocks';
```

`Source` is a React component which accepts props of type `SourceProps`.

<div class="aside">

ℹ️ Like most blocks, the `Source` block can both be configured via props when using it directly in MDX, or with properties in `parameters.docs.source`.

</div>

#### `SourceProps`

##### `code`

Type: `string`

Provides the source code to be rendered.

<!-- prettier-ignore-start -->
```md
{/* ButtonDocs.mdx */}
import { Meta, Source } from '@storybook/blocks';
import * as ButtonStories from './Button.stories';

<Meta of={ButtonStories} />

<Source code={`const thisIsCustomSource = true;
if (isSyntaxHighlighted) {
  console.log('syntax highlighting is working');
}`} />
```
<!-- prettier-ignore-end -->

##### `dark`

Type: `boolean`

Determines if snippet is rendered in dark mode.

##### `format`

Type: `boolean | 'dedent' | BuiltInParserName`

Default: `true`

Specifies the formatting used on source code. Supports all valid [prettier parser names](https://prettier.io/docs/en/configuration.html#setting-the-parserdocsenoptionshtmlparser-option).

##### `language`

Type: `'jsextra' | 'jsx' | 'json' | 'yml' | 'md' | 'bash' | 'css' | 'html' | 'tsx' | 'typescript' | 'graphql'`

Default: `'jsx'`

Specifies the language used for syntax highlighting.

##### `of`

Type: Story export

Specifies which story's source is rendered.

##### `type`

Type: `'auto' | 'code' | 'dynamic'`

Default: `'auto'`

Specifies how the source code is rendered.

- **auto**: Same as `dynamic`, if supported by the framework in use; otherwise same as `code`
- **code**: Renders the value of `code` prop, otherwise renders static story source
- **dynamic**: Renders the story source with dynamically updated arg values

<div class="aside">

💡 Note that dynamic snippets will only work if the Story block for the story is also rendered.

</div>

##### `id` (deprecated)

Type: `string`

Specifies the story id for which to render the source code. Referencing a story this way is no longer supported; use the [`of` prop](#of), instead.

##### `ids` (deprecated)

Type: `string[]`

Specifies the story ids for which to render source code. Multiple stories are no longer supported; to render a single story's source, use use the [`of` prop](#of).
