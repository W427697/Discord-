import React from 'react';
import CoreMenu from '../../containers/core_menu';
import { colorScheme } from '../theme';

const rootStyle = {
  backgroundColor: colorScheme.block,
  padding: 6,
  paddingTop: 2,
  marginTop: 10,
};

const Menu = () => (
  <div style={rootStyle}>
    <CoreMenu downDirection />
  </div>
);

export default Menu;
