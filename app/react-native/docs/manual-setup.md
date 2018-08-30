# Manual Setup

First, install the `@storybook/react-native` module

```sh
npm install @storybook/react-native
```

Create a new directory called `storybook` in your project root and create an entry file (index.ios.js or index.android.js) as given below. (Don't forget to replace "MyApplicationName" with your app name).

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

const StorybookUIRoot = getStorybookUI({ port: 7007, onDeviceUI: true });

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

Create a file called rn-addons.js

In this file you can import all the addons that work inside rn simulator.

If you want to have addons inside browser, create a file named `addons.js` file in `storybook`. Here is a list of default addons:

```js
import '@storybook/addon-actions';
import '@storybook/addon-links';
```

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

Then add following NPM script into your `package.json` file:

```json
{
  "scripts": {
    "storybook": "storybook start -p 7007"
  }
}
```
