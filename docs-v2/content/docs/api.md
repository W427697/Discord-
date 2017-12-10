# Storybook API

Lorem ipsum Consumer Storybook API

## Consumer Storybook API

### storiesOf


```js // story.js | react
import { storiesOf } from '@storybook/react';

const storyKind = storiesOf('storyName', module);
```

Calling `storiesOf` returns a [storyKind](#storykind) object.

> **You should call it with 2 parameters**:
> - `storyName` [string] - name of storykind. Will be shown at the stories panel.
> - `module` - webpack module object. This enables HMR.

You can use a special character (by default `/`) to create a hierachy:
```js // story.js | react
import { storiesOf } from '@storybook/react';

const storyKind = storiesOf('core/atoms/component-x', module);
```
This character [can be configured](/docs/). TODO: link

### storyKind
Get a storyKind object by calling [`storiesOf`](#storiesOf).

It exposes a method called `add`.

> **You should call it with 2 parameters**:
> - `name` [string] - name of variation. Will be shown at the stories panel.
> - `renderFn` - This function will be passed to the renderer in the [preview](/api/docs). TODO: link

```js // story.js | react
import { storiesOf } from '@storybook/react';

const storyKind = storiesOf('storyName', module);

storyKind.add('first variation', () => <div>Hello world</div>);
```

`add()` returns the same `storyKind` object, allowing chaining:
```js // story.js | react
import { storiesOf } from '@storybook/react';

storiesOf('storyName', module)
  .add('variation A', () => <div>A</div>)
  .add('variation B', () => <div>B</div>);
```

## Configure Storybook API
Storybook needs to know what stories to load.
You have to pass a function the the `configure` function that will `require` all your stories:

```js // config.js | react
import { configure } from '@storybook/react';

function loadStories() {
  require('../stories/story1.js');
  require('../stories/story2.js');
}

configure(loadStories, module);
```

### co-location of stories with components
We actually recommend you place your story files next to the source of your components.
If you're already co-locating your unit tests, this will feel very natural to you.

### Loading stories dynamically

Loading a static list of `require`s will get old really quickly. In fact we recommend you load your stories dynamically rather than explicitly.

For example, you may write stories for your app inside the `src/components` directory with the `.stories.js` extension. 
Simply edit your config directory at `.storybook/config.js` as follows:

```js // config.js | react
import { configure } from '@storybook/react';

const req = require.context('../src/components', true, /\.stories\.js$/)

function loadStories() {
  req.keys().forEach((filename) => req(filename))
}

configure(loadStories, module);
```

Here we use Webpack's [`require.context`](https://webpack.js.org/guides/dependency-management/#require-context) to load modules dynamically. 
Have a look at the relevant Webpack [docs](https://webpack.js.org/guides/dependency-management/#require-context) to learn more about how to use `require.context`.

The **React Native** packager resolves all the imports at build-time, so it's not possible to load modules dynamically. 
If you don't want to import all your stories manually you can use [react-native-storybook-loader](https://github.com/elderfo/react-native-storybook-loader) to automatically create the import statements for all of your stories. 

## Internal Storybook API

### UI API
TODO: write this section

### UI mantra modules API
TODO: write this section

### Story Store API
TODO: write this section
