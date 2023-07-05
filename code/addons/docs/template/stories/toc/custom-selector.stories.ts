import { global as globalThis } from '@storybook/global';
import { One, Two, Three } from './basic.stories';

export default {
  component: globalThis.Components.Button,
  tags: ['autodocs'],
  parameters: {
    chromatic: { disable: true },
    docs: { toc: { headingSelector: 'h1, h2, h3' } },
  },
};

export { One, Two, Three };
