import React, { Component } from 'react';

import { View, ScrollView, TouchableOpacity, Text } from 'react-native';
import AddonWrapper from './addon-wrapper';

export default class AddonsList extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      // selectedAddon: null,
      addonVisible: true,
    };
  }

  onClose = () => {
    this.setState({
      addonVisible: false,
    });
  };

  renderTab = title => (
    <TouchableOpacity
      style={{
        marginRight: 15,
      }}
      key={title}
      // onPress={}
    >
      <Text
        style={{
          color: 'black',
          fontSize: 16,
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  render() {
    return (
      <View>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          horizontal
          style={{
            marginLeft: 10,
            marginRight: 40,
            flexDirection: 'row',
          }}
        >
          {this.renderTab('Amazing addon')}
          {this.renderTab('Another addon')}
          {this.renderTab('What addon?')}
          {this.renderTab('No addon')}
        </ScrollView>
        <AddonWrapper visible={this.state.addonVisible} onClose={this.onClose}>
          <Text>Hey hey hey</Text>
        </AddonWrapper>
      </View>
    );
  }
}
