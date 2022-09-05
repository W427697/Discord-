import React from 'react';
import PropTypes from 'prop-types';

export const Code = ({ code }) => (
  <pre>
    <code data-testid="code">{code}</code>
  </pre>
);

Code.propTypes = {
  code: PropTypes.string.isRequired,
};
