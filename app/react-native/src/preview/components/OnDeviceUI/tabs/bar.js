import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import Button from './button';
import { NAVIGATOR, PREVIEW, ADDONS } from './consts';

export default class Bar extends PureComponent {
  render() {
    return (
      <View style={{ flexDirection: 'row' }}>
        <Button onPress={this.props.onPress} index={NAVIGATOR}>
          Navigator
        </Button>
        <Button onPress={this.props.onPress} index={PREVIEW}>
          Preview
        </Button>
        <Button onPress={this.props.onPress} index={ADDONS}>
          Addons
        </Button>
      </View>
    );
  }
}

Bar.propTypes = {
  onPress: PropTypes.func.isRequired,
};
