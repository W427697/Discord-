# Writing stories

Writing stories are what storybook is all about. Stories should describe your component, and the variation it can exist in.

This guide has a lot of overlap with our [api section](/docs/api), but is more directed at the practical side. It also provides [framework/app](/guides/understanding/#apps) specific code and tips.

## Components and variations

## Example component
Let's suppose we have an extremely simple component like this:

:::CodeSwitcher
```js // Button.js | react
import React from 'react';

const Button = ({ onClick, children }) => (
  <button onClick={onClick}>{children}</button>
);

export default Button;
```
:::

## Write a simple story
We can write an equally simple story for it:

:::CodeSwitcher
```js // story.js | react
import React from 'react';
import { storiesOf } from '@storybook/react';

import Button from './Button';

storiesOf('Button', module).add('our first story', () => (
  <Button onClick={() => console.log('clicked')}>Hello Button</Button>
));
```
:::

Are we done? Have we shown all possible variations of the button component? **No**.

The truth is: every component that takes props (*especially children*) will have **infinite** variations. Obviously writing infinite stories is not an option, and unproductive to say the least.

So let's come up with a set of stories we'd like to see. The variations of your components should really be real examples of how your component is used or could be used in your application. Here's an example for the example Button component:

:::CodeSwitcher
```js // story.js | react
import React from 'react';
import { storiesOf } from '@storybook/react';

import Button from './Button';

storiesOf('Button', module)
  .add('short text', () => (
    <Button onClick={() => {}}>Hello Button</Button>
  ))
  .add('long text', () => (
    <Button onClick={() => {}}>
      The ridiculously long Button
    </Button>
  ))
  .add('not just text', () => (
    <Button onClick={() => {}}>
      The <strong>ridiculously</strong> long Button
    </Button>
  ));
```
:::

## Display component edge cases
Let's imagine we have a `Carousel` component. And it takes a list of data to render as props.
Let's also imagine the data for this component is coming from a CMS of some kind. 
Because of the external and high dynamic nature of the data, it's important for us to know the component is resilient enough.
Let's write some stories:

:::CodeSwitcher
```js // story.js | react
import React from 'react';
import { storiesOf } from '@storybook/react';

import Carousel from './Carousel';
import mockdata from './mockdata';

storiesOf('Carousel', module)
  .add('default', () => <Carousel data={[mockdata, mockdata, mockdata]} />)
  .add('single', () => <Carousel data={[mockdata]} />)
  .add('none', () => <Carousel data={[]} />)
  .add('100', () => <Carousel data={new Array(100).fill(mockdata)} />);
```
:::

## Addons
This is just our core API for writing stories. In addition to this, you can use the official and third party Storybook [addons](/docs/addons) to get more functionality.

Just a small selection of the very popular ones:

### Actions
Instead of logging things to the console or doing nothing, we can use [an addon called 'actions'](/docs/addons/actions) to log data to panel:

:::CodeSwitcher
```js // story.js | react
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Button from './Button';

// BEFORE
storiesOf('Button', module).add('our first story', () => (
  <Button onClick={() => console.log('clicked')}>Hello Button</Button>
));

// AFTER
storiesOf('Button', module).add('our first story', () => (
  <Button onClick={action('clicked')}>Hello Button</Button>
));
```
:::


### Links
If you want to forego stateful components in storybook, but still be able to navigate to a specific variation you can use [the 'links' addon](/docs/addons/link):

:::CodeSwitcher
```js // story.js | react
import React from 'react';
import { storiesOf } from '@storybook/react';
import { linkTo } from '@storybook/addon-actions';

import Button from './Button';

storiesOf('Button', module)
  .add('variant1', () => (
    <Button onClick={linkTo('Button', 'variant2')}>Hello Button</Button>
  ))
  .add('variant2', () => (
    <Button onClick={linkTo('Button', 'variant1')}>Hello Button</Button>
  ));
```
:::

### Knobs
As mentioned before, most components can have infinite variations, but there is a way for you to get to all those states within storybook.
The answer is [the 'knobs' addon](/docs/addons/knobs).

It allows you to change props via a GUI at runtime.

:::CodeSwitcher
```js // story.js | react
import React from 'react';
import { storiesOf } from '@storybook/react';
import { text } from '@storybook/addon-actions/react';

import Button from './Button';

storiesOf('Button', module).add('with knobs', () => (
  <Button onClick={() => {}}>
    {text('Hello Button')}
  </Button>
));
```
:::

### Notes
As your library of component and stories grows, you'll want to use it to explain and document your components too. 
We've build [an addon called 'notes'](/docs/addons/notes) for this purpose.

Though there are other addons available that also focus on adding documentation to storybook, like [info](/docs/addons/info) and [readme](https://github.com/tuchk4/storybook-readme).

:::CodeSwitcher
```js // story.js | react
import { storiesOf } from '@storybook/react';
import { withNotes } from '@storybook/addon-notes';
import Component from './Component';
import someMarkdownText from './someMarkdownText.md';

storiesOf('Component', module).add(
  'With Markdown',
  withNotes(someMarkdownText)(() => <Component />)
);
```
:::

