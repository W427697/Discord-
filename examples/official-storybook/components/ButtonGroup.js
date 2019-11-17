import React from 'react';
import PropTypes from 'prop-types';

export const ButtonGroup = ({ background, children }) => (
  <div style={{ background }}>{children}</div>
);

ButtonGroup.defaultProps = {
  background: '#ff0',
  children: null,
};

ButtonGroup.propTypes = {
  background: PropTypes.string,
  children: PropTypes.element,
};
