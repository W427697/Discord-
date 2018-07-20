import { AppRegistry } from 'react-native';
import React, { Component } from 'react';
import { getStorybookUI, configure } from '@storybook/react-native';
import { setOptions } from '@storybook/addon-options';

require('react-native-storybook-knobs/register').register();
require('storybook-usage/register');
// import stories
configure(() => {
  // eslint-disable-next-line global-require
  require('./stories');
}, module);

const { EventEmitter } = require('events');

const channel = new EventEmitter();

const addons = require('@storybook/addons').default;

addons.setChannel(channel);
const rnAddons = require('@storybook/react-native').addons;

rnAddons.setChannel(channel);

const StorybookUIRoot = getStorybookUI({ port: 7007, onDeviceUI: true });

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
    return <StorybookUIRoot />;
  }
}

AppRegistry.registerComponent('crna-kitchen-sink', () => StorybookUIHMRRoot);
export default StorybookUIHMRRoot;
