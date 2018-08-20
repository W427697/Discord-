import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import Button from './button';
import { NAVIGATOR, PREVIEW, ADDONS } from './consts';

export default class Bar extends PureComponent {
  render() {
    const { index, onPress } = this.props;
    return (
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 8,
          backgroundColor: 'white',
          borderBottomWidth: 1,
          borderTopWidth: 1,
          borderBottomColor: 'rgba(0, 0, 0, 0.1)',
          borderTopColor: 'rgba(0, 0, 0, 0.1)',
        }}
      >
        <Button onPress={onPress} id={NAVIGATOR} active={index === NAVIGATOR}>
          NAVIGATOR
        </Button>
        <Button onPress={onPress} id={PREVIEW} active={index === PREVIEW}>
          PREVIEW
        </Button>
        <Button onPress={onPress} id={ADDONS} active={index === ADDONS}>
          ADDONS
        </Button>
      </View>
    );
  }
}

Bar.propTypes = {
  onPress: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
};
