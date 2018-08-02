import { View, AppRegistry } from 'react-native';
import React, { Component } from 'react';
import { Constants } from 'expo';
import { getStorybookUI, configure } from '@storybook/react-native';
import { setOptions } from '@storybook/addon-options';

// TODO temp disable till I find a way to fix usage addon
console.disableYellowBox = true;

require('react-native-storybook-knobs/register').register();
require('storybook-usage/register');
// import stories
configure(() => {
  // eslint-disable-next-line global-require
  require('./stories');
}, module);

const StorybookUIRoot = getStorybookUI({
  port: 7007,
  onDeviceUI: true,
  disableWebsockets: true,
  isUIOpen: true,
  isStoryMenuOpen: true,
});

setTimeout(
  () =>
    setOptions({
      name: 'CRNA React Native App',
      onDeviceUI: true,
    }),
  100
);

// react-native hot module loader must take in a Class - https://github.com/facebook/react-native/issues/10991
// eslint-disable-next-line react/prefer-stateless-function
class StorybookUIHMRRoot extends Component {
  render() {
    return (
      <View style={{ flex: 1, marginTop: Constants.statusBarHeight }}>
        <StorybookUIRoot />
      </View>
    );
  }
}

AppRegistry.registerComponent('crna-kitchen-sink', () => StorybookUIHMRRoot);
export default StorybookUIHMRRoot;
