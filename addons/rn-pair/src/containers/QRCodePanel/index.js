/* eslint-disable no-underscore-dangle */

import React from 'react';
import PropTypes from 'prop-types';

import QRCodeComponent from '../../components/QRCode';

export default class QRCodePanel extends React.PureComponent {
  constructor(props, ...args) {
    super(props, ...args);
    this.state = {
      pairedId: null,
    };

    this._actionListener = action => this.addAction(action);
  }

  componentDidMount() {
    this.props.channel.on('channelCreated', this._actionListener);
  }

  componentWillUnmount() {
    this.props.channel.removeListener('channelCreated', this._actionListener);
  }

  addAction(data) {
    this.setState({
      pairedId: data.pairedId,
    });
  }

  render() {
    return <QRCodeComponent {...this.state} />;
  }
}

QRCodePanel.propTypes = {
  channel: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};
QRCodePanel.defaultProps = {
  channel: {},
};
