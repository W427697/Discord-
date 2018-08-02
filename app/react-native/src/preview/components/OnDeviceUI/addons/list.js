import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native';

import style from '../style';

import Tab from './tab';

export default class AddonList extends PureComponent {
  static propTypes = {
    panels: PropTypes.objectOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        render: PropTypes.func.isRequired,
      }).isRequired
    ).isRequired,
    onPressAddon: PropTypes.func.isRequired,
  };

  renderTab = (id, title) => (
    <Tab key={id} id={id} title={title} onPress={this.props.onPressAddon} />
  );

  render() {
    const addonKeys = Object.keys(this.props.panels);

    return (
      <ScrollView showsHorizontalScrollIndicator={false} horizontal style={style.addonList}>
        {addonKeys.map(id => this.renderTab(id, this.props.panels[id].title))}
      </ScrollView>
    );
  }
}
