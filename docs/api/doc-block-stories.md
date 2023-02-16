---
title: 'Stories'
---

The `Stories` block renders the full collection of stories in a stories file.

![Screenshot of Stories block](TK)

## API

### Stories

```js
import { Stories } from '@storybook/blocks';
```

`Stories` is a React component which accepts props of type `StoriesProps`.

<div class="aside">

ℹ️ Like most blocks, the `Stories` block can both be configured via props when using it directly in MDX, or with properties in `parameters.docs.stories`.

</div>

#### `StoriesProps`

##### `includePrimary`

Type: `boolean`

Default: `true`

Determines if the collection of stories includes the primary (first) story.

<div class="aside">

💡 If a stories file contains only one story and `includePrimary={true}`, the `Stories` block will render nothing to avoid a potentially confusing situation.

</div>

##### `title`

Type: `string`

Default: `'Stories'`

Sets the heading content preceding the collection of stories.
