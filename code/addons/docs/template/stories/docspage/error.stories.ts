import { global as globalThis } from '@storybook/global';

export default {
  component: globalThis.Components.Button,
  tags: ['autodocs'],
  args: { label: 'Click Me!' },
  parameters: { chromatic: { disable: true } },
};

/**
 * A story that throws
 */
export const ErrorStory = {
  render: () => {
    throw new Error('Story did something wrong');
  },
};
