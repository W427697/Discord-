# Manual Setup

First, install the `@storybook/react-native` module

```sh
npm install @storybook/react-native
```

Create a new directory called `storybook` in your project root and create an entry file (index.js)as given below.
(Don't forget to replace "MyApplicationName" with your app name).

```js
import { AppRegistry } from 'react-native';
import React, { Component } from 'react';
import { getStorybookUI, configure } from '@storybook/react-native';
import { setOptions } from '@storybook/addon-options';
import './rn-addons';

// import stories
configure(() => {
  // eslint-disable-next-line global-require
  require('./stories');
}, module);

const StorybookUIRoot = getStorybookUI();

setTimeout(
  () =>
    setOptions({
      name: 'React Native Vanilla',
    }),
  100
);

class StorybookUIHMRRoot extends Component {
  render() {
    return <StorybookUIRoot />;
  }
}

AppRegistry.registerComponent('MyApplicationName', () => StorybookUIHMRRoot);
export default StorybookUIHMRRoot;
```

Create a file called `rn-addons.js`
In this file you can import on device addons.

Then write your first story in the `stories` directory like this:

```js
import { storiesOf } from '@storybook/react-native';
import { View, Text } from 'react-native';

const style = {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#F5FCFF'
};
const CenteredView = ({ children }) => (
  <View style={style}>
    {children}
  </View>
);

storiesOf('CenteredView')
  .add('default view', () => (
    <CenteredView>
      <Text>Hello Storybook</Text>
    </CenteredView>
  ));
```

Finally replace your app entry with
```js
import './storybook';
```
If you cannot replace your entry point just make sure that the component exported from `./storybook` is displayed
somewhere in your app. `StorybookUI` is simply a RN `View` component that can be embedded anywhere in your 
RN application, e.g. on a tab or within an admin screen.

## Server support

If you want to support having a storybook server running add following NPM script into your `package.json` file:

```json
{
  "scripts": {
    "storybook": "storybook start -p 7007"
  }
}
```

If you want to have addons inside browser, create a file named `addons.js` file in `storybook`. Here is a list of default addons:

```js
import '@storybook/addon-actions';
import '@storybook/addon-links';
```

