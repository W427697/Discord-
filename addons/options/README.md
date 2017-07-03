# Storybook Options Addon

[![Greenkeeper badge](https://badges.greenkeeper.io/storybooks/storybook.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/storybooks/storybook.svg?branch=master)](https://travis-ci.org/storybooks/storybook)
[![CodeFactor](https://www.codefactor.io/repository/github/storybooks/storybook/badge)](https://www.codefactor.io/repository/github/storybooks/storybook)
[![Known Vulnerabilities](https://snyk.io/test/github/storybooks/storybook/8f36abfd6697e58cd76df3526b52e4b9dc894847/badge.svg)](https://snyk.io/test/github/storybooks/storybook/8f36abfd6697e58cd76df3526b52e4b9dc894847)
[![BCH compliance](https://bettercodehub.com/edge/badge/storybooks/storybook)](https://bettercodehub.com/results/storybooks/storybook) [![codecov](https://codecov.io/gh/storybooks/storybook/branch/master/graph/badge.svg)](https://codecov.io/gh/storybooks/storybook)
[![Storybook Slack](https://storybooks-slackin.herokuapp.com/badge.svg)](https://storybooks-slackin.herokuapp.com/)

The Options addon can be used to set configure the [Storybook](https://storybook.js.org) UI.

This addon works with Storybook for:
[React](https://github.com/storybooks/storybook/tree/master/app/react) and
[React Native](https://github.com/storybooks/storybook/tree/master/app/react-native).

![Screenshot](docs/screenshot.png)

## Getting Started

First, install the addon

```sh
npm install -D @storybook/addon-options
```

Add this line to your `addons.js` file (create this file inside your storybook config directory if needed).

```js
import '@storybook/addon-options/register';
```

Import and use the `setOptions` function in your config.js file.

```js
import * as storybook from '@storybook/react';
import { setOptions } from '@storybook/addon-options';

setOptions({
  name: 'My Component', // change the name displayed in the left top portion
  url: 'https://github.com/user/my-component', // change its URL
  goFullScreen: false, // switch to fullscreen mode
  showLeftPanel: false, // show the stories panel
  showDownPanel: false, // show the addons panel
  showSearchBox: false, // show the search box
  downPanelInRight: false, // show the addons panel at the right side
  sortStoriesByKind: true, // Sort the list of stories by their "kind"
  hierarchySeparator: /\/|:\//, // regular expression to separate stories nesting
  multistorySeparator: /:/, // regular expression to separate multistories section
  previewDecorator: stories => <div>{stories}</div>, // root decorator for preview
});

storybook.configure(() => require('./stories'), module);
```
