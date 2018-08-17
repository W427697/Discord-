import React, { PureComponent } from 'react';
import { StyleSheet, Animated } from 'react-native';
import PropTypes from 'prop-types';

import style from '../style';

export default class Panel extends PureComponent {
  render() {
    return (
      <Animated.View style={[StyleSheet.absoluteFillObject, style.flex, ...this.props.style]}>
        {this.props.children}
      </Animated.View>
    );
  }
}

Panel.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  style: PropTypes.array.isRequired,
  children: PropTypes.node.isRequired,
};
