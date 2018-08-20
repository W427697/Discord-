import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { View, Text, TouchableOpacity } from 'react-native';

export default class Button extends PureComponent {
  onPress = () => {
    this.props.onPress(this.props.id);
  };

  render() {
    return (
      <TouchableOpacity onPress={this.onPress}>
        <Text
          style={[
            {
              color: 'rgba(0, 0, 0, 0.4)',
              paddingHorizontal: 8,
              paddingVertical: 10,
              fontSize: 11,
            },
            this.props.active && {
              color: 'rgb(68, 68, 68)',
            },
          ]}
        >
          {this.props.children.toUpperCase()}
        </Text>
        <View
          style={[
            {
              height: 3,
              backgroundColor: 'transparent',
            },
            this.props.active && {
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
            },
          ]}
        />
      </TouchableOpacity>
    );
  }
}

Button.propTypes = {
  onPress: PropTypes.func.isRequired,
  active: PropTypes.bool.isRequired,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  children: PropTypes.node.isRequired,
};
