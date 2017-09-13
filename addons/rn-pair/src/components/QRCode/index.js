/* eslint-disable no-undef */
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import QrCode from 'qrcode.react';

import style from './style';

class QRCodeComponent extends PureComponent {
  render() {

    const secured = this.props.secured || window.location.protocol === 'https:';

    const port = this.props.port !== false ? (this.props.port || window.location.port) : 'false';

    const value = [
      this.props.host || window.location.hostname,
      port,
      this.props.pairedId,
      secured ? 'true' : 'false',
    ].join('|');

    return (
      <div style={style.wrapper}>
        {this.props.pairedId &&
          <div>
            <p>
              Code: {this.props.pairedId}
            </p>
            <p>Scan the code with your phone to pair</p>
            <QrCode value={value} />
          </div>}
      </div>
    );
  }
}

QRCodeComponent.propTypes = {
  pairedId: PropTypes.string,
  host: PropTypes.string,
  port: PropTypes.string,
  secured: PropTypes.bool,
};

QRCodeComponent.defaultProps = {
  pairedId: null,
  host: null,
  port: null,
  secured: null,
};

export default QRCodeComponent;
