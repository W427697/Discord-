---
title: 'Subtitle'
---

The `Subtitle` block can serve as a secondary heading for your docs entry.

![Screenshot of Subtitle block](TK)

<!-- prettier-ignore-start -->
```md
{/* ButtonDocs.mdx */}

import { Subtitle } from '@storybook/blocks';

<Subtitle>Allows the user to start an action</Subtitle>
```
<!-- prettier-ignore-end -->

## Subtitle

```js
import { Subtitle } from '@storybook/blocks';
```

`Subtitle` is configured with the following props:

### `children`

Type: `JSX.Element | string`

Default: `parameters.componentSubtitle`

Provides the content.
