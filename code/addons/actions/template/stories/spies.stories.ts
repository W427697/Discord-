import { global as globalThis } from '@storybook/global';
import { withActions } from '@storybook/addon-actions/decorator';
import { spyOn } from '@storybook/test';

export default {
  component: globalThis.Components.Button,
  loaders() {
    spyOn(console, 'log').mockName('console.log');
  },
  args: {
    label: 'Button',
  },
  parameters: {
    chromatic: { disable: true },
  },
};

export const ShowSpyOnInActions = {
  args: {
    onClick: () => {
      console.log('first');
      console.log('second');
    },
  },
};
