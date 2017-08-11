import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import QrCode from 'qrcode.react';

import style from './style';

class QRCodeComponent extends PureComponent {
  render() {
    return (
      <div style={style.wrapper}>
        {this.props.pairedId &&
          <div>
            <p>
              Code: {this.props.pairedId}
            </p>
            <p>Scan the code with your phone to pair</p>
            <QrCode value={this.props.pairedId} />
          </div>}
      </div>
    );
  }
}

QRCodeComponent.propTypes = {
  pairedId: PropTypes.string,
};

QRCodeComponent.defaultProps = {
  pairedId: null,
};

export default QRCodeComponent;
