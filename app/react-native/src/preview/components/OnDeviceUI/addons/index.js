import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';

import AddonsList from './list';
import AddonWrapper from './wrapper';

export default class Addons extends PureComponent {
  static propTypes = {
    panels: PropTypes.objectOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        render: PropTypes.func.isRequired,
      }).isRequired
    ).isRequired,
    onPressAddon: PropTypes.func.isRequired,
    addonSelected: PropTypes.string,
  };

  static defaultProps = {
    addonSelected: '',
  };

  render() {
    const { panels, onPressAddon, addonSelected } = this.props;

    if (Object.keys(panels).length === 0) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 17 }}>No on device addons loaded</Text>
        </View>
      );
    }

    return (
      <View style={{ flex: 1 }}>
        <AddonsList onPressAddon={onPressAddon} panels={panels} addonSelected={addonSelected} />
        <AddonWrapper addonSelected={addonSelected} panels={panels} />
      </View>
    );
  }
}
