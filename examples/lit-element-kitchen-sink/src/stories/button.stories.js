import { document } from 'global';
import { html } from 'lit-element';
import { action } from '@storybook/addon-actions';

import '../components/simple-button';

export default {
  title: 'Demo',
};

export const heading = () =>
  html`
    <h1>Hello World</h1>
  `;
export const headings = () =>
  html`
    <h1>Hello World</h1>
    <h2>Hello World</h2>
    <h3>Hello World</h3>
    <h4>Hello World</h4>
  `;

export const button = () => {
  const btn = document.createElement('simple-button');
  btn.innerHTML = 'Hello Button';
  btn.addEventListener('click', action('Click'));
  return btn;
};
