# UI Options

Storybook UI is configurable via a list of options. You can set these options via an [addon](/docs/addons/options).

This document outlines the API for this.

## The API

You need to install the following package:
```sh
yarn add @storybook/addon-options --dev
```

And then import `setOptions`:
```js
import { setOptions } from '@storybook/addon-options';
```

The `setOptions` function can now be used to change options at run-time. The function will take a single parameter: an object:

```js
import { setOptions } from '@storybook/addon-options';

setOptions({
  optionsName: 'value',
});
```

You'll need to add a `addons.js` file and register the addon:
:::CodeSwitcher
```js // addons.js
import '@storybook/addon-options/register';
```
:::

## The available options

### name (*string*)
Name to display in the top left corner.
   
example:
```
name: 'Storybook',
```

### url (*string*)
Set a link on the logo / name in the top left.
   
example:
```
url: 'https://example.com',
```

### goFullScreen (*boolean*)
Show story component as full screen
   
example:
```
goFullScreen: false,
```

### showStoriesPanel (*boolean*)
Display panel that shows a list of stories
   
example:
```
showStoriesPanel: true,
```

### showAddonPanel (*boolean*)
Display panel that shows addon configurations

example:
```
showAddonPanel: true,
```

### showSearchBox (*boolean*)
Display floating search box to search through stories

example:
```
showSearchBox: false,
```

### addonPanelInRight (*boolean*)
Show addon panel as a vertical panel on the right

example:
```
addonPanelInRight: false,
```

### sortStoriesByKind (*boolean*)
Enable sorting of stories by kind. (normally sorting happens by order of require in `config.js`).

example:
```
sortStoriesByKind: false,
```

### hierarchySeparator (*regex*)
Set a regular expression for finding the hierarchy separator. More info about story hierarchy in the [organization guide](/guides/organization/).

The value `null` will turn the feature **OFF**. The default value is `/\//`.

example:
```
hierarchySeparator: /|/,
```

### sidebarAnimations (*boolean*)
Enable the sidebar animation. If the animations bother you, you can disable them.

example:
```
sidebarAnimations: true,
```

### selectedAddonPanel (*string*)
Choose which addon panel to have selected. If you leave this empty the first panel will be opened by default as you run Storybook

The order of addons is the same as you import them in `addons.js`. 

example:
```
selectedAddonPanel: 'actions',
```

## Set options in `config.js`

Settings options globally for all storybook should be done within the `config.js` within the storybook config folder (*usually .storybook*).

:::CodeSwitcher
```js // config.js
import { setOptions } from '@storybook/addon-options';

setOptions({
  name: 'Yolobook',
  hierarchySeparator: /|/,
  selectedAddonPanel: 'actions',
});
```
:::

## Set options within stories
It is also possible to call `setOptions()` anywhere inside individual stories.

> **Note**: that this will have a significantly impact on story render performance.

:::CodeSwitcher
```js // story.js | react
import React from 'react';
import { storiesOf } from '@storybook/react';
import { setOptions } from '@storybook/addon-options';

storiesOf('Button', module).add('our first story', () => {
  setOptions({
    selectedAddonPanel: 'actions',
  });
  return <button>Hello Button</button>
});
```
:::
