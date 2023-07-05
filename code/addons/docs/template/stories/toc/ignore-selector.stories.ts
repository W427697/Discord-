import { global as globalThis } from '@storybook/global';
import { One, Two, Three } from './basic.stories';

export default {
  component: globalThis.Components.Button,
  tags: ['autodocs'],
  parameters: {
    chromatic: { disable: true },
    docs: { toc: { ignoreSelector: '#one' } },
  },
};

export { One, Two, Three };
