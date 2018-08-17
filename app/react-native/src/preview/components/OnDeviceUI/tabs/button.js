import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Text, TouchableOpacity } from 'react-native';

export default class Button extends PureComponent {
  onPress = () => {
    this.props.onPress(this.props.index);
  };

  render() {
    return (
      <TouchableOpacity onPress={this.onPress}>
        <Text>{this.props.children}</Text>
      </TouchableOpacity>
    );
  }
}

Button.propTypes = {
  onPress: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
};
