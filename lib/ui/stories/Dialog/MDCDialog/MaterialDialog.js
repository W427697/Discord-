// @flow
import React, { Component } from 'react';
import '@material/dialog/dist/mdc.dialog.min.css';
import '@material/button/dist/mdc.button.min.css';
import { MDCDialog } from '@material/dialog/dist/mdc.dialog.min';

type Props = {
  title: string,
  children?: React$Node,
  acceptLabel: string,
  onAccept: () => void,
  declineLabel: string,
  onDecline: () => void,
};

class MaterialDialog extends Component<Props> {
  static defaultProps = {
    description: undefined,
    acceptLabel: undefined,
    declineLabel: undefined,
    children: undefined,
  };

  componentDidMount = () => {
    if (this.dialog) {
      const element = this.dialog.querySelector('.mdc-dialog');
      this.myDialog = new MDCDialog(element);
      MDCDialog.attachTo(element);
      setTimeout(() => this.myDialog.show(), 0);
      this.myDialog.listen('MDCDialog:accept', this.accept);
      this.myDialog.listen('MDCDialog:cancel', this.decline);
    }
  };

  accept = () => {
    setTimeout(() => {
      if (this.props.onAccept) this.props.onAccept();
    }, 300);
  };

  decline = () => {
    setTimeout(() => {
      if (this.props.onDecline) this.props.onDecline();
    }, 300);
  };

  myDialog: MDCDialog;
  dialog: ?HTMLDivElement;

  render() {
    return (
      <div
        ref={e => {
          this.dialog = e;
        }}
        style={{ position: 'fixed', zIndex: 10 }}
      >
        <aside
          className="mdc-dialog"
          role="alertdialog"
          aria-labelledby="dialog-label"
          aria-describedby="dialog-description"
        >
          <div className="mdc-dialog__surface">
            <header className="mdc-dialog__header">
              <h2 id="dialog-label" className="mdc-dialog__header__title">
                {this.props.title}
              </h2>
            </header>
            <section id="dialog-description" className="mdc-dialog__body">
              {this.props.children}
            </section>
            <footer className="mdc-dialog__footer">
              <button
                type="button"
                className="mdc-button
                mdc-dialog__footer__button
                mdc-dialog__footer__button--cancel"
              >
                {this.props.declineLabel}
              </button>
              <button
                type="button"
                className="mdc-button
                mdc-dialog__footer__button
                mdc-dialog__footer__button--accept"
              >
                {this.props.acceptLabel}
              </button>
            </footer>
          </div>
          <div className="mdc-dialog__backdrop" />
        </aside>
      </div>
    );
  }
}

export default MaterialDialog;
