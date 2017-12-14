# Writing stories

Writing stories are what storybook is all about. Stories should describe your component, and the variation it can exist in.

This guide has a lot of overlap with our [api section](/docs/api), but is more directed at the practical side. It also provides [framework/app](/guides/understanding/#apps) specific code and tips.

## Components and variations

## Example component
Let's suppose we have an extremely simple component like this:

:::Test { frameworkDependent: true }
```js // button.js | react
import React from 'react';

export default const Button = ({ onClick, children }) => (
  <button onClick={onClick}>{children}</button>
);
```
:::

## Write a single story
We can write an equally simple story for it:

:::Test { frameworkDependent: true }
```js // config.js | react
import React from 'react';
import { storiesOf } from '@storybook/react';

import Button from './Button';

storiesOf('Button', module).add('our first story', () => (
  <Button onClick={() => console.log('clicked')}>Hello Button</Button>
));
```
:::

Are we done? Have we shown all possible variations of the button component? No. The truth is: every component that takes props (*especially children*) will have infinite variations. Obviously writing infinite stories is not an option, and unproductive to say the least.

So let's come up with a set of stories we'd like to see. The variations of your components should really be real examples of how your component is used or could be used in your application. Here's an examplez for the example Button component:


:::Test { frameworkDependent: true }
```js // config.js | react
import React from 'react';
import { storiesOf } from '@storybook/react';

import Button from './Button';

storiesOf('Button', module)
  .add('short text', () => (
    <Button onClick={() => console.log('clicked')}>Hello Button</Button>
  ))
  .add('long text', () => (
    <Button onClick={() => console.log('clicked')}>
      The ridiculously long Button
    </Button>
  ))
  .add('not just text', () => (
    <Button onClick={() => console.log('clicked')}>
      The <strong>ridiculously</strong> long Button
    </Button>
  ));
```
:::

This will show stories in your storybook like this:

![Basic stories](../static/basic-stories.png)

This is just our core API for writing stories. In addition to this, you can use the official and third party Storybook [addons](/addons/introduction) to get more functionality.
