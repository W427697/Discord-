import { global as globalThis } from '@storybook/global';
import { spyOn } from '@storybook/test';

const meta = {
  component: globalThis.Components.Button,
  beforeEach() {
    spyOn(console, 'log').mockName('console.log');
    console.log('first');
  },
};

export default meta;

export const ShowSpyOnInActions = {
  beforeEach() {
    console.log('second');
  },
  args: {
    label: 'Button',
    onClick: () => {
      console.log('third');
    },
  },
};
