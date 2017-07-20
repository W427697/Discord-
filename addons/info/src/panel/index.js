import React from 'react';
import ReactDom from 'react-dom';
import PropTypes from 'prop-types';
import { EVENT_ID } from '../config';

export default class InfoPanel extends React.Component {
  constructor(props) {
    super(props);
    this.root = null;

    this.onChannelData = this.onChannelData.bind(this);
  }

  componentDidMount() {
    this.props.channel.on(EVENT_ID, this.onChannelData);
  }

  onChannelData(data) {
    this.root.innerHTML = data.infoString;
    ReactDom.render(null, this.root);
  }

  render() {
    return (
      <div
        ref={c => {
          this.root = c;
        }}
      >
        Info Panel
      </div>
    );
  }
}

InfoPanel.propTypes = {
  channel: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};
