# Storybook API

Lorem ipsum Consumer Storybook API

## Consumer Storybook API

### Stories API

Package: [@storybook/react](https://github.com/storybooks/storybook/tree/master/app/react)

available:

```js
import { storiesOf } from '@storybook/react'
```

usage: 

```js
const storyKind = storiesOf(storyName, module);
```

Return [storyKind](/api/#storykind) object.

`storyName` [string] - name of storykind. will be shown at the stories panel.

module - webpack module object.

example:

```js
const buttonStory = storiesOf('Button', module);
```

#### storyKind

### setAddon API

### Addon panels API

### setOptions API

### storyshorts

## Internal Storybook API

### UI API

### UI mantra modules API

### Story Store API
