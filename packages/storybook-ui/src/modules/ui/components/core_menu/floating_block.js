import React from 'react';
import PropTypes from 'prop-types';
import CoreMenu from '../../containers/core_menu';
import { colorScheme, floating } from '../theme';
import { boxPositions } from '../../../../libs/menu_positions';

const rootStyle = {
  position: 'absolute',

  backgroundColor: colorScheme.block,
  borderRadius: 2,
  paddingBottom: 2,
  ...floating,
};

function getPosition(pos) {
  switch (pos) {
    case boxPositions.BOTTOM_RIGHT:
      return {
        right: 10,
        bottom: 20,
      };
    case boxPositions.TOP_LEFT:
      return {
        left: 10,
        top: 20,
      };
    case boxPositions.TOP_RIGHT:
      return {
        right: 10,
        top: 20,
      };
    default:
      return {
        left: 10,
        bottom: 20,
      };
  }
}

const FloatingBlock = ({ position }) => (
  <div style={{ ...rootStyle, ...getPosition(position) }}>
    <CoreMenu downDirection={position === boxPositions.TOP_LEFT || position === boxPositions.TOP_RIGHT} />
  </div>
);

FloatingBlock.propTypes = {
  position: PropTypes.string,
};

export default FloatingBlock;
