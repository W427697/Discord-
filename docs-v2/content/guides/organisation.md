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

# Writing stories that show multiple variants
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
