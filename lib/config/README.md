# Storybook Config

This package is a config splitter to allow the mono config:

👉 `storybook.config.js` 👈

## Reason

We want users to have the convience of setting up storybook in a single config file.
This means the config for theming, babel, webpack, entrypoints, custom headers, middleware, presets, etc... is availeble in 1 place.

This file is a javascript file, with all the power that comes with javascript.
We allow users to create a webpack config right alongside the creation of the theme for storybook. This does pose a technical challange though!

This package deals with that challange.

## What's the challange of the mono config?

Part 1 of the challange is that a javascript config file wll contain dependencies, and references to objects, functions, etc. 
Part 2 is that not all config data is for relavent or even allowed in all environments for storybook.

For example the node server needs to know about the webpack config, entrypoints and presets, but it doesn't need the theme config.
Likewise the manager needs the config for the layout and theme, but it's config should not include dependencies for webpack!

## What does it do?

Taking a `storybook.config.js` file, this module can transform it into a number of sub-config files. Each sub-config is for a specific environment.

It does so by removing exports not listed in a safelist, followed by treeshaking the module.

### Wouldn't tree-shaking be able to do this?

Maybe, but it's fragile.

## How to write your `storybook.config.js`

It's an ES module! You export things:

```js
export const entries = ['**/*.stories.*'];
```

This configures storybook to auto-load all files as stories that match the glob.

Keep things as pure as possible in this module. A great way of doing this, is by only having imports and exports.
**The config splitter assumes all imported modules to be pure.**

Here's an example of setting a storybook theme:

```js
import { create } from '@storybook/theming';

export const theme = create({ brandTitle: 'My amazing storybook' });
```

Here's a more complete example:

```js
import { create } from '@storybook/theming';
import CustomWebpackPlugin from 'example-webpack-plugin';

export const entries = ['**/*.stories.*'];
export const theme = create({ brandTitle: 'My amazing storybook' });

export const addons = ['@storybook/addon-knobs', '@storybook/addon-notes'];

export const webpack = async (config, env) => ({
  ...config,
  plugins: [...config.plugins, new CustomWebpackPlugin()],
});
```


## Future improvements

- Typescript support (`storybook.config.ts`).
- Improve this documentation so all config options are explained.