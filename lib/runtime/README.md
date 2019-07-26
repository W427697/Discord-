# Storybook Runtime

Storybook runtime runs stories and displays them using their designated framework; it itself is framework agnostic.

## API

```js
import { add } from '@storybook/runtime';

add({
  title: 'My Component',
  module, // used for HMR
  stories: { storyA, storyB },
});
```

### Interface

// WIP

```ts
import { DecoratorFn, Renderable } from '@storybook/addons';

interface StoryMeta<Framework> {
  title: string;
  component?: Renderable<Framework>;
  decorators?: DecoratorFn<Framework>[];
  parameters?: Parameters;
}

interface Stories<Framework> {
  stories: {
    [name: string]: StoryFn<Framework>;
  };
}
interface Module {
  module: NodeModule;
}

export type AddInterface<Framework> = StoryMeta<Framework> & Stories<Framework> & Module
```