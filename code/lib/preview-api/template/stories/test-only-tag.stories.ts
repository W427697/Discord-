import { global as globalThis } from '@storybook/global';

export default {
  component: globalThis.Components.Button,
  tags: ['autodocs', 'test-only'],
};

export const Default = {
  args: { label: 'Button' },
};
