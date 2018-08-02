import React, { Component } from 'react';

import { View, ScrollView, TouchableOpacity, Text } from 'react-native';
import addons from '@storybook/addons';
import AddonWrapper from './addon-wrapper';
import style from './style';

export default class AddonsList extends Component {
  constructor(...args) {
    super(...args);

    addons.loadAddons();
    const panels = addons.getPanels();

    this.addons = Object.keys(panels).reduce((acc, addonKey) => {
      acc[addonKey] = {
        title: panels[addonKey].title,
        render: panels[addonKey].render(),
      };
      return acc;
    }, {});

    this.state = {
      selectedAddon: null,
      addonVisible: false,
    };
  }

  onClose = () => {
    this.setState({
      addonVisible: false,
    });
  };

  onPressAddon = id => {
    this.setState({
      addonVisible: true,
      selectedAddon: id,
    });
  };

  renderTab = (id, title) => (
    <TouchableOpacity style={style.tab} key={id} onPress={() => this.onPressAddon(id)}>
      <Text style={style.text}>{title}</Text>
    </TouchableOpacity>
  );

  render() {
    const addonKeys = Object.keys(this.addons);

    return (
      <View>
        <ScrollView showsHorizontalScrollIndicator={false} horizontal style={style.addonList}>
          {addonKeys.map(id => this.renderTab(id, this.addons[id].title))}
        </ScrollView>
        <AddonWrapper visible={this.state.addonVisible} onClose={this.onClose}>
          {addonKeys.filter(id => id !== this.state.selectedAddon).map(id => (
            <View key={id} style={style.invisible}>
              {this.addons[id].render}
            </View>
          ))}
          {this.state.selectedAddon ? this.addons[this.state.selectedAddon].render : null}
        </AddonWrapper>
      </View>
    );
  }
}
