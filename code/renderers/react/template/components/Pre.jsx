import React from 'react';
import PropTypes from 'prop-types';

export const Pre = ({ object, text }) => (
  <pre data-testid="pre">{object ? JSON.stringify(object, null, 2) : text}</pre>
);

Pre.propTypes = {
  object: PropTypes.shape({}),
  text: PropTypes.string,
};

Pre.defaultProps = {
  object: null,
  text: null,
};
