// @flow
import React, { Component } from 'react';
import { action } from '@storybook/addon-actions';

import Dialog from './MDCDialog';

class Exemple extends Component<{}, { show: boolean }> {
  state = {
    show: false,
  };
  render() {
    return (
      <div>
        <button
          className="mdc-button mdc-button--raised"
          onClick={() => {
            this.setState({ show: true }, () => action('Dialog show')(`show: ${this.state.show}`));
          }}
        >
          Dialog
        </button>
        <Dialog
          show={this.state.show}
          onAccept={() => {
            this.setState({ show: false }, () =>
              action('Dialog accept')('accept', `show: ${this.state.show}`)
            );
          }}
          onDecline={() => {
            this.setState({ show: false }, () =>
              action('Dialog cancel')('cancel', `show: ${this.state.show}`)
            );
          }}
          title="Title"
          declineLabel="Cancel"
          acceptLabel="Accept"
        >
          <p style={{ fontSize: 14 }}>My dialog is pretty cool, right ?</p>
        </Dialog>
      </div>
    );
  }
}

export default Exemple;
