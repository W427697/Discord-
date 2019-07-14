# Storybook Renderer React

React renderer for Storybook can be used for declaring React stories in `@storybook/html`.

## Getting Started

Install:

```sh
npm i -D @storybook/renderer-react
```

Then, add following content to `.storybook/config.js`

```js
import {addDecorator} from '@storybook/html'
import withReact from '@storybook/renderer-react'

addDecorator(withReact)
```

Then, you can add `{framework: 'react'}` parameter to mark React stories:

```js
import React from 'react';
import { storiesOf } from '@storybook/html';

import Button from './button';

storiesOf('Button', module)
  .addParameters({framework: 'react'})
  .add('default view', () => (
    <Button onClick={action('button-click')}>Hello World!</Button>
  ));
```
