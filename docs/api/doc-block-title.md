---
title: 'Title'
---

The `Title` block serves as the primary heading for your docs entry. It is typically used to provide the component or page name.

![Screenshot of Title block](TK)

## API

### Title

```js
import { Title } from '@storybook/blocks';
```

`Title` is a React component which accepts props of type `TitleProps`.

#### `TitleProps`

##### `children`

Type: `JSX.Element | string`

Provides the content. Falls back to value of `meta.title` (or value derived from [autotitle](../configure/sidebar-and-urls.md#csf-30-auto-titles)), trimmed to the last segment. For example, if the title value is `'path/to/components/Button'`, the default content is `'Button'`.
