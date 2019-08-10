import { LitElement, html, css } from 'lit-element';
import { customElements } from 'global';

export class SimpleButton extends LitElement {
  static get properties() {
    return {
      title: { type: String },
      disabled: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.title = 'Button';
  }

  onButtonClicked = e => {
    console.log('SimpleButton clicked!');
  };

  render() {
    return html`
      <button @click="${this.onButtonClicked}" ?disabled=${this.disabled}>${this.title}</button>
    `;
  }
}

customElements.define('simple-button', SimpleButton);
