# Storybook UI

Storybook UI the core UI of [storybook](https://storybook.js.org).
It's a React based UI which you can initialize with a function.
You can configure it by providing a provider API.

## Usage

First you need to install `@storybook/ui` into your app.

```sh
yarn add @storybook/ui --dev
```

Optionally you can to create a Provider class like this:

```js
import React from 'react';
import { Provider } from '@storybook/ui';

export default class MyProvider extends Provider {
  getElements(type) {
    return {};
  }

  renderPreview() {
    return <p>This is the Preview</p>;
  }

  handleAPI(api) {
    // no need to do anything for now.
  }
}
```

Then you need to initialize the UI like this:

```js
import { document } from 'global';
import renderStorybookUI from '@storybook/ui';
import Provider from './provider';

const roolEl = document.getElementById('root');
renderStorybookUI(roolEl, new Provider());
```
