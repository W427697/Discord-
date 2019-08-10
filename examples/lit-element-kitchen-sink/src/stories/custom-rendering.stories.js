import { document } from 'global';
import { html } from 'lit-element';
import '../components/simple-message';
import '../components/simple-button';

export default {
  title: 'Rendering Methods',
};

export const story1 = () => '<div>Rendered with string!</div>';
story1.story = { name: 'html string' };

export const story2 = () => `<simple-message message='Rendered from lit-element'></simple-message>`;
story2.story = { name: 'lit-element' };

export const story3 = () => {
  const el = document.createElement('simple-message');
  el.setAttribute('message', 'Rendered from document.createElement');
  return el;
};
story3.story = { name: 'document.createElement' };

export const story4 = () => `<simple-button title='Rendered from button'></simple-button>`;
story4.story = { name: 'simple-button' };
