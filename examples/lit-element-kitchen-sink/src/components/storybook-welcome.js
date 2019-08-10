import { customElements } from 'global';
import { LitElement, html, css } from 'lit-element';

export class StorybookWelcome extends LitElement {
  static get properties() {
    return {
      logo: { type: String },
    };
  }

  static get styles() {
    return css`
      .main {
        padding: 15px;
        line-height: 1.4;
        font-family: 'Helvetica Neue', Helvetica, 'Segoe UI', Arial, freesans, sans-serif;
        background-color: #ffffff;
      }

      .logo {
        width: 256px;
        margin: 15px;
      }

      .code {
        font-size: 15px;
        font-weight: 600;
        padding: 2px 5px;
        border: 1px solid #eae9e9;
        border-radius: 4px;
        background-color: #f3f2f2;
        color: #3a3a3a;
      }
    `;
  }

  render() {
    return html`
      <div class="main">
        <h1>Welcome to Storybook for LitElement</h1>
        <p>This is a UI component dev environment for your LitElement app.</p>
        <p>
          We've added some basic stories inside the <code class="code">stories</code> directory.
          <br />
          A story is a single state of one or more UI components. You can have as many stories as
          you want.
          <br />
          (Basically a story is like a visual test case.)
        </p>
        <p>See these sample <a class="link" href="#">stories</a></p>
        <p><img src=${this.logo} class="logo" /></p>
        <p>
          Just like that, you can add your own snippets as stories.
          <br />
          You can also edit those snippets and see changes right away.
          <br />
        </p>
        <p>
          Usually we create stories with smaller UI components in the app.<br />
          Have a look at the
          <a class="link" href="https://storybook.js.org/basics/writing-stories" target="_blank">
            Writing Stories
          </a>
          section in our documentation.
        </p>
      </div>
    `;
  }
}

customElements.define('storybook-welcome', StorybookWelcome);
