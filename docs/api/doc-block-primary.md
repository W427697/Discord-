---
title: 'Primary'
---

The `Primary` block displays the primary (first defined in the stories file) story, in a [`Story`](./doc-block-story.md) block. It is typically rendered immediately under the title in a docs entry.

![Screenshot of Primary block](TK)

## API

### Primary

```js
import { Primary } from '@storybook/blocks';
```

`Primary` is a React component which accepts props of type `PrimaryProps`.

#### `PrimaryProps`

##### `name` (deprecated)

Type: `string`

Primary block should only be used to render the primary story, which is automatically found.
