import React from 'react';
import PropTypes from 'prop-types';

export const Button = ({ onClick, children }) =>
  React.createElement('button', { type: 'button', onClick }, children);

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};
