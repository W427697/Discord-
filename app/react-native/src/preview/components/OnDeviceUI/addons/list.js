import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView } from 'react-native';

import style from '../style';

import Button from '../tabs/button';

export default class AddonList extends PureComponent {
  static propTypes = {
    panels: PropTypes.objectOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        render: PropTypes.func.isRequired,
      }).isRequired
    ).isRequired,
    onPressAddon: PropTypes.func.isRequired,
    addonSelected: PropTypes.string.isRequired,
  };

  renderTab = (id, title) => {
    const { addonSelected, onPressAddon } = this.props;

    return (
      <Button active={id === addonSelected} key={id} id={id} onPress={onPressAddon}>
        {title}
      </Button>
    );
  };

  render() {
    const { panels } = this.props;
    const addonKeys = Object.keys(panels);

    return (
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: 'white',
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(0, 0, 0, 0.1)',
        }}
      >
        <ScrollView showsHorizontalScrollIndicator={false} horizontal style={style.addonList}>
          {addonKeys.map(id => this.renderTab(id, panels[id].title))}
        </ScrollView>
      </View>
    );
  }
}
