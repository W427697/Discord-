import React from 'react';
import PropTypes from 'prop-types';

export const Html = ({ contents }) => <div dangerouslySetInnerHTML={{ __html: contents }} />;

Html.propTypes = {
  contents: PropTypes.string.isRequired,
};
