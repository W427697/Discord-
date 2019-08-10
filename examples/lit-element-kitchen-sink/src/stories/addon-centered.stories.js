import centered from '@storybook/addon-centered/html';
import '../components/simple-button';

export default {
  title: 'Addons|Centered',
  decorators: [centered],
};

export const story1 = () =>
  `<simple-button title='This button should be centered'></simple-button>`;
story1.story = { name: 'button in center' };

export const story2 = () =>
  `<simple-button title='This button should not be centered'></simple-button>`;
story2.story = {
  name: 'button not in center',
  parameters: {
    centered: { disable: true },
  },
};
