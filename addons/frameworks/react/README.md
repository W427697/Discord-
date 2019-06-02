# Storybook Addon React

React addon for Storybook can be used for declaring React stories in `@storybook/html`.

## Getting Started

Install:

```sh
npm i -D @storybook/addon-react
```

Then, add following content to `.storybook/config.js`

```js
import {addDecorator} from '@storybook/html'
import withReact from '@storybook/addon-react'

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
