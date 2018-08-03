import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import AddonWrapper from './modal';
import style from '../style';

export default class Wrapper extends PureComponent {
  static propTypes = {
    panels: PropTypes.objectOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        render: PropTypes.func.isRequired,
      }).isRequired
    ).isRequired,
    visible: PropTypes.bool.isRequired,
    addonSelected: PropTypes.string,
    onClose: PropTypes.func.isRequired,
  };

  static defaultProps = {
    addonSelected: '',
  };

  render() {
    const addonKeys = Object.keys(this.props.panels);

    return (
      <AddonWrapper visible={this.props.visible} onClose={this.props.onClose}>
        {addonKeys.map(id => {
          const selected = this.props.visible && this.props.addonSelected === id;

          return (
            <View key={id} style={selected ? null : [style.modalInvisible, style.invisible]}>
              {this.props.panels[id].render({ active: selected })}
            </View>
          );
        })}
      </AddonWrapper>
    );
  }
}
