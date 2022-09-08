import React from 'react';
import PropTypes from 'prop-types';

// eslint-disable-next-line react/no-danger
export const Html = ({ contents }) => <div dangerouslySetInnerHTML={{ __html: contents }} />;

Html.propTypes = {
  contents: PropTypes.string.isRequired,
};
