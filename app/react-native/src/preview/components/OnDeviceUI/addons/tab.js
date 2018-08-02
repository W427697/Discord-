import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, Text } from 'react-native';

import style from '../style';

export default class Tab extends PureComponent {
  static propTypes = {
    onPress: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  };

  onPress = () => {
    this.props.onPress(this.props.id);
  };

  render() {
    const { title } = this.props;
    return (
      <TouchableOpacity style={style.tab} onPress={this.onPress}>
        <Text style={style.text}>{title}</Text>
      </TouchableOpacity>
    );
  }
}
