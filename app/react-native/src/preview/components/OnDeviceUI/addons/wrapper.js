import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView } from 'react-native';

import style from '../style';

export default class Wrapper extends PureComponent {
  static propTypes = {
    panels: PropTypes.objectOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        render: PropTypes.func.isRequired,
      }).isRequired
    ).isRequired,
    addonSelected: PropTypes.string,
  };

  static defaultProps = {
    addonSelected: '',
  };

  render() {
    const addonKeys = Object.keys(this.props.panels);

    return addonKeys.map(id => {
      const selected = this.props.addonSelected === id;

      return (
        <View key={id} style={selected ? style.flex : [style.modalInvisible, style.invisible]}>
          <ScrollView style={{ flex: 1 }}>
            {this.props.panels[id].render({ active: selected })}
          </ScrollView>
        </View>
      );
    });
  }
}
