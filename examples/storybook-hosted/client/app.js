import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, NavigatorIOS, TouchableOpacity } from 'react-native';

import { getStorybook } from './storybook';
import QRCodeScanner from 'react-native-qrcode-scanner';

class App extends Component {
  render() {
    return (
      <NavigatorIOS
        initialRoute={{
          component: ScanScreen,
          title: 'Scan Code',
        }}
        style={{ flex: 1 }}
      />
    );
  }
}

class ScanScreen extends Component {
  startStorybook(e) {
    const [host, port, pairedId, secured] = e.data.split('|');

    alert(`Host: ${host}, Port: ${port}, PairedId: ${pairedId}, Secured: ${secured}`);

    const StorybookUI = getStorybook(
      () => {
        require('./storybook/stories');
      },
      module,
      {
        port,
        host,
        query: `pairedId=${pairedId}`,
        secured,
        manualId: true,
        resetStorybook: true,
      }
    );

    this.props.navigator.push({
      title: 'Storybook',
      component: StorybookUI,
    });
  }

  render() {
    return (
      <QRCodeScanner
        onRead={this.startStorybook.bind(this)}
        topContent={<Text style={styles.centerText}>Scan qr code displayed in web browser</Text>}
      />
    );
  }
}

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

AppRegistry.registerComponent('RNStorybookHostedClient', () => ScanScreen);
