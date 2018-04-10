// @flow
import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import MaterialDialog from './MaterialDialog';

type Props = {
  show: boolean,
  title: string,
  children?: React$Node,
  acceptLabel: string,
  onAccept: () => void,
  declineLabel: string,
  onDecline: () => void,
};

class Dialog extends Component<Props> {
  portalContainer: ?HTMLElement;
  componentDidMount = () => {
    this.portalContainer = document.getElementById('dialog_container');
    if (!this.portalContainer) {
      this.portalContainer = document.createElement('div');
      this.portalContainer.setAttribute('id', 'dialog_container');
      if (this.portalContainer && document.body) {
        document.body.appendChild(this.portalContainer);
      }
    }
  };

  render() {
    return this.props.show && this.portalContainer
      ? createPortal(<MaterialDialog {...this.props} />, this.portalContainer)
      : null;
  }
}

export default Dialog;
