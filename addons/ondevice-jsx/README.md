# Storybook JSX Addon for react-native

This addon let you display the story's declaration inside a device panel.
The display is generated from the actual component, so they are not 100% accurate.

## Installation

```sh
yarn add -D @storybook/addon-ondevice-jsx
```

## Configuration

Create a file called `rn-addons.js` in your storybook config.

Add following content to it:

```js
import '@storybook/addon-ondevice-jsx/register';
```

Then import `rn-addons.js` next to your `getStorybookUI` call.

```js
import './rn-addons';
```

## Usage

Import the `JSX` decorator and use it next to your stories

```js
import { addDecorator, storiesOf } from '@storybook/react-native';
import { JSX } from '@storybook/jsx';

addDecorator(JSX);

storiesOf(...);
```

The decorator order matters in the list, so if some information is missing (knobs for example), you should put it at the top.
