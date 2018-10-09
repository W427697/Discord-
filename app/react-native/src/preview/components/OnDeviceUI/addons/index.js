import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';

import AddonsList from './list';
import AddonWrapper from './wrapper';
import style from '../style';

export default class Addons extends PureComponent {
  render() {
    const { panels, onPressAddon, addonSelected } = this.props;

    if (Object.keys(panels).length === 0) {
      return (
        <View style={[style.flex, style.center]}>
          <Text style={style.text}>No onDevice addons loaded</Text>
        </View>
      );
    }

    return (
      <View style={style.flex}>
        <AddonsList onPressAddon={onPressAddon} panels={panels} addonSelected={addonSelected} />
        <AddonWrapper addonSelected={addonSelected} panels={panels} />
      </View>
    );
  }
}

Addons.propTypes = {
  panels: PropTypes.objectOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      render: PropTypes.func.isRequired,
    }).isRequired
  ).isRequired,
  onPressAddon: PropTypes.func.isRequired,
  addonSelected: PropTypes.string,
};

Addons.defaultProps = {
  addonSelected: '',
};
