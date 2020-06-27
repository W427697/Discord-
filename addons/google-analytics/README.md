# Storybook Google Analytics Addon

Storybook Addon Google Analytics can be used to support google analytics in [Storybook](https://storybook.js.org).

[Framework Support](https://github.com/storybookjs/storybook/blob/master/ADDONS_SUPPORT.md)

## Installation

Install the following npm module:

```sh
npm i --save-dev @storybook/addon-google-analytics
```

or with yarn:

```sh
yarn add -D @storybook/addon-google-analytics
```

within `.storybook/main.js`:

```js
module.exports = {
  addons: ['@storybook/addon-google-analytics']
}
```

## Configuration

The analytics addon can be configured by story parameters with the `analytics` key.  To configure globally, import `addParameters` from your app layer in your `preview.js` file.
By default, Storybook falls back to `window.STORYBOOK_GA_ID` and `window.STORYBOOK_GA_OPTIONS` global variables if parameters are not specified.

```js
import { addParameters } from '@storybook/client-api';

addParameters({
  analytics: {
    reactGAId: 'UA-000000-01',
    reactGAOptions: {}
  },
});
```
