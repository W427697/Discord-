import { LitElement, html } from 'lit-element';
import { customElements } from 'global';

export class SimpleMessage extends LitElement {
  static get properties() {
    return {
      message: { type: String },
      color: { type: String },
    };
  }

  constructor() {
    super();
    this.message = 'Default Message';
  }

  render() {
    return html`
      <style>
        p {
          color: ${this.color};
        }
      </style>
      <p>${this.message}</p>
    `;
  }
}

customElements.define('simple-message', SimpleMessage);
