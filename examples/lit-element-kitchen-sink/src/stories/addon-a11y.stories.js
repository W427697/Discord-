import { document, setTimeout } from 'global';
import { withA11y } from '@storybook/addon-a11y';
import '../components/simple-button';

const text = 'Testing the a11y addon';

export default {
  title: 'Addons|a11y',
  decorators: [withA11y],
  parameters: {
    options: { selectedPanel: 'storybook/a11y/panel' },
  },
};

export const Default = () => `<simple-button></simple-button>`;
export const Label = () => `<simple-button title='${text}'></simple-button>`;
export const Disabled = () => `<simple-button title='${text}' disabled></simple-button>`;
export const story4 = () => {
  const div = document.createElement('simple-button');
  setTimeout(() => {
    div.innerHTML = `<simple-button title='This button has a delayed render of 1s'></simple-button>`;
  }, 1000);
  return div;
};
story4.story = { name: 'Delayed render' };
