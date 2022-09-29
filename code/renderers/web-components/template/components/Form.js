/* eslint-disable import/no-extraneous-dependencies */
import globalThis from 'global';
import { html, LitElement } from 'lit';

const { CustomEvent, customElements } = globalThis;

/**
 * Form test component for framework-independent stories
 *
 * @tag sb-form
 */
export class SbForm extends LitElement {
  // Currently TS decorators are not reflected so we have to use static `properties` function
  // https://github.com/Polymer/lit-html/issues/1476
  static get properties() {
    return {
      value: { type: String },
      complete: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.value = '';
    this.complete = false;
  }

  onSubmit() {
    const options = {
      bubbles: true,
      composed: true,
    };

    this.dispatchEvent(new CustomEvent('sb-form:success', options));

    setTimeout(() => {
      this.complete = true;
    }, 500);

    setTimeout(() => {
      this.complete = false;
    }, 1500);
  }

  render() {
    return html`
      <form id="interaction-test-form" @submit=${this.onSubmit}>
        <label>
          Enter Value
          <input
            type="text"
            data-testid="value"
            value=${this.value}
            required
            @change=${(event) => {
              event.preventDefault();
              this.value = event.target.value;
            }}
          />
        </label>
        <button type="submit">Submit</button>
        ${this.complete && '<p>Completed!!</p>'}
      </form>
    `;
  }
}

export const FormTag = 'sb-form';
customElements.define(FormTag, SbForm);
