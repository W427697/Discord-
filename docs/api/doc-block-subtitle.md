---
title: 'Subtitle'
---

The `Subtitle` block can serve as a secondary heading for your docs entry.

![Screenshot of Subtitle block](TK)

## API

### Subtitle

```js
import { Subtitle } from '@storybook/blocks';
```

`Subtitle` is a React component which accepts props of type `SubtitleProps`.

#### `SubtitleProps`

##### `children`

Type: `JSX.Element | string`

Provides the content. Falls back to value of `parameters.componentSubtitle`.
