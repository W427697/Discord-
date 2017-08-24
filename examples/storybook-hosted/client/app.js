import React, { Component } from 'react';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { AppRegistry, StyleSheet, Text } from 'react-native';

import { getStorybook } from './storybook';

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },

  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },

  buttonTouchable: {
    padding: 16,
  },
});


class App extends Component {

  constructor() {
    super();
    this.storybookComponent = null;

    this.state = {
      init: false,
    };
  }

  startStorybook(e) {
    const [host, port, pairedId, secured] = e.data.split('|');

    this.storybookComponent = getStorybook(
      () => {
        // eslint-disable-next-line global-require
        require('./storybook/stories');
      },
      module,
      {
        port,
        host,
        query: `pairedId=${pairedId}`,
        secured: secured === '1',
        manualId: true,
        resetStorybook: true,
      }
    );

    this.setState({
      init: true,
    });
  }

  render() {

    if (!this.state.init) {
      return (
        <QRCodeScanner
          onRead={() => this.startStorybook()}
          topContent={<Text style={styles.centerText}>Scan qr code displayed in web browser</Text>}
        />
      );
    }

    return (<this.storybookComponent />);
  }
}


AppRegistry.registerComponent('client', () => App);
