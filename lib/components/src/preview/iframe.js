import React, { Component } from 'react';
import PropTypes from 'prop-types';

// this component renders an iframe, which gets updates via post-messages
export class IFrame extends Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    const { id, title, src, ...rest } = this.props;
    return <iframe scrolling="yes" id={id} title={title} src={src} allowFullScreen {...rest} />;
  }
}
IFrame.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
};
