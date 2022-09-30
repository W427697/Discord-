/* eslint-disable import/no-extraneous-dependencies */
import globalThis from 'global';
import { LitElement } from 'lit';

const { customElements } = globalThis;

/**
 *
 * @tag sb-html
 */
export class SbHtml extends LitElement {
  static get properties() {
    return {
      content: { type: String },
    };
  }

  constructor() {
    super();
    this.content = '';
  }

  render() {
    this.renderRoot.innerHTML = this.content;
  }
}

export const HtmlTag = 'sb-html';
customElements.define(HtmlTag, SbHtml);
