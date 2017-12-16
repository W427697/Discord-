# Organizing your storybook component library

Creating a ton of components and stories is the easy part. After a while you'll want to transform your development tool into something more.

Maybe you're the type of person who wants to categorize their components into specific buckets like [atomic design](http://bradfrost.com/blog/post/atomic-web-design/), or maybe this is a pure necessity for you, because you have hundreds of components.

Either way, storybook will allow you to create such categories / hierarchies.

## Create a simple hierarchy

Here's how simple it is to create hierarchy in Storybook:

```js // story.js | react
import React from 'react';
import { storiesOf } from '@storybook/react';

import Button from './Button';

storiesOf('Atoms/Button', module)
  .add('variant 1', () => <Button>Hello Button</Button>)
  .add('variant 2', () => <Button>Hello Button</Button>);
```

This creates a nested structure like so:

```
*
└── Atoms
    └── Buttons
        ├── variant_1
        └── variant_2    
```

## Create a deep hierarchies
Creating deeper hierarchies is just as simple as, in fact you can create a hierarchy as deep as you want like this!

Separate the levels with the `/`-symbol.
If you don't like the symbol, it is configurable in [options](/docs/addons/options).

## Writing stories that show multiple variants
Currently this isn't really a core feature of storybook. 
But we're working on this to make this a first class citizen and a joy to use.

It's a very often requested feature:

> How can I show all possible button states in 1 view?

> Is it possible to display all icons in a grid?

Well the answer is yes, but not using the default [storybook API](/docs/api). 
When you call `.add()`, this creates a separate view. *this will change in the future (likely with the 4.0 release)*.

But knowing this we can of course create a wrapper component and just render our component in multiple variations in that:

```js // story.js | react
import React from 'react';
import { storiesOf } from '@storybook/react';

import Button from './Button';

storiesOf('Atoms/Button', module)
  .add('collection', () => (
    <div>
      <Button size={0}>Hello Button</Button>
      <Button size={1}>Hello Button</Button>
      <Button size={2}>Hello Button</Button>
    </div>
  ));
```

We could event create a specialized styleguide demo-component to possibly display the list of variations a bit nicer:


```js // story.js | react
import React from 'react';
import { storiesOf } from '@storybook/react';
import { DemoGrid } from '../styleguide/components';

import Button from './Button';

storiesOf('Atoms/Button', module)
  .add('collection', () => (
    <DemoGrid>
      <Button size={0}>Hello Button</Button>
      <Button size={1}>Hello Button</Button>
      <Button size={2}>Hello Button</Button>
    </DemoGrid>
  ));
```

This would allow you to create beautiful overviews of all variations within 1 storybook view.
After all, it's just showing some components, no magic here.

> So in the future we're going to be releasing a feature that would allow you to view multiple views at once. 
> 
> That way you can get the best of both: write isolated stories that are clear to read, and view them as a collection or individually.

## Decorators
Decorators are like little wrapper components that you can use to add context, statemanagement or some styling around your component.

It can be used in lots of ways, probably more ways then we can imagine.

You can think of decorators are a functional component that receives the `storyFn` as a parameter and should call it, and return a element with the result of the `storyFn` in it. Mind, that the decorator doesn't **have** to wrap the story, it can. It can be used to do analytics on the story too!.

### Signature of a decorator
```js
const decoratorName = (storyFn) => (
  <WrappingComponent>{storyFn()}</WrappingComponent>
);
```

### Example
For example, let's say we want to center a story rendered on the screen. For that, we can use a wrapper component like this:

```js
const styles = {
  textAlign: 'center',
};
const Center = ({ children }) => (
  <div style={styles}>
    { children }
  </div>
);
```

Then we can use it when writing stories.

```js
import { storiesOf } from '@storybook/react';

import Center from './center';
import Button from './button';

storiesOf('Button', module)
  .add('with text', () => (
    <Center>
      <Button>Hello Button</Button>
    </Center>
  ));
```

But notice how we're poluting the story like this, and we're likely going to be repeating ourselves a lot. We don't like repeating ourselfs now do we?

So let's use a decorator instead!

```js
import { storiesOf } from '@storybook/react';

import Button from './button';

const styles = {
  textAlign: 'center',
};
const CenterDecorator = (storyFn) => (
  <div style={{ textAlign: 'center' }}>{storyFn()}</div>
);

storiesOf('Button', module)
  .addDecorator(CenterDecorator)
  .add('with text', () => <Button>Hello Button</Button>);
```


### Use cases of decorators
Here are the prime use-cases we have identified:

#### Add a styled wrapper
**See the example above**, this adds the ability to change the size of your component (*make it bigger then a viewport, for example*), or see how it responds to being in a floating container etc.

It also allows you to test the component within a global css namespace-class this can be useful if your styling responds to for example modernizr classes:

```js
const CenterDecorator = (storyFn) => (
  <div className="no-flexbox">{storyFn()}</div>
);
```

#### Add context redux state
Some components will maybe need redux state to operate, and so this state will have to be provided (*using context*) via a `Provider` component.

You can actually extract this from your stories via a decorator:

```js
import { storiesOf, action } from '@storybook/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import ConnectedButton from './ConnectedButton';

storiesOf('Button', module)
  .addDecorator(fn => (
    <Provider store={createStore(() => {}, {})}>{fn()}</Provider>
  ))
  .add('connected', () => <ConnectedButton>Redux Button</ConnectedButton>);
```

#### Add context router
Same as with the redux usecase: we can use the the `MemoryRouter` component as a decorator to provide the needed properties on context:

```js
import { storiesOf, action } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';

import RoutedButton from './RoutedButton';

storiesOf('Button', module)
  .addDecorator(fn => (
    <MemoryRouter>{fn()}</MemoryRouter>
  ))
  .add('default', () => <RoutedButton>Router Button</RoutedButton>);
```

#### Analytics on story
In a decorator you have access to the `storyFn` and you can have access to the output of the `storyFn` before returning it to the renderer.

This would allow you to pass this into a tool for analysis.

```js
import { storiesOf, action } from '@storybook/react';

import Button from './Button';

storiesOf('Button', module)
  .addDecorator(fn => {
    const out = fn();

    // perform any action with the rendered story

    return out;
  })
  .add('default', () => <Button>Router Button</Button>);
```

### Global decorators
You can also add a decorator globally for all stories like this:

```js
import { storiesOf, addDecorator } from '@storybook/react';

import { ComponentA, ComponentB } from './components';
import { myDecorator } from '../decorators';

addDecorator(myDecorator);

storiesOf('ComponentA', module).add('default', () => (
  <ComponentA />
));

storiesOf('ComponentB', module).add('default', () => (
  <ComponentB />
));
```

You can call `addDecorator()` inside the story definition file as shown above. 
But note that this adds the decorator to **all** stories, not just the ones defined in this module.

For this reason we strongly recommend you add global decorators via the [`.storybook/config.js`](/docs/api/#configure-storybook-api) file only.

## Use render props / slots
Taken from the [writing stories example](/guides/writing-stories#display-component-edge-cases):
Let's imagine we have a `Carousel` component. And it takes a list of data to render as props.
Let's write a story:

:::Test { frameworkDependent: true }
```js // story.js | react
import React from 'react';
import { storiesOf } from '@storybook/react';

import Carousel from './Carousel';
import mockdata from './mockdata';

storiesOf('Carousel', module)
  .add('default', () => <Carousel data={[mockdata, mockdata, mockdata]} />);
```
:::

Now this carousel is encapsulating everything about the CarouselItems, there's not control besides the `data`-prop.

A very smart pattern is to provide a sub-component as a prop itself, often called a 'renderProp', [read more about this pattern](https://cdb.reacttraining.com/use-a-render-prop-50de598f11ce).

It turns out this pattern is also really well suited for storybook:

:::Test { frameworkDependent: true }
```js // story.js | react
import React from 'react';
import { storiesOf } from '@storybook/react';

import Carousel, { CarouselItemTypeA, CarouselItemTypeB }  from './Carousel';
import mockdata from './mockdata';

storiesOf('Carousel', module)
  .add('with CarouselItemTypeA', () => (
    <Carousel 
      data={[mockdata, mockdata, mockdata]}
      itemComponent={CarouselItemTypeA}
    />
  ))
  .add('with CarouselItemTypeB', () => (
    <Carousel 
      data={[mockdata, mockdata, mockdata]}
      itemComponent={CarouselItemTypeB}
    />
  ));
```
:::

Who knew that making more flexible components would also make it easier to build, test and document them?
