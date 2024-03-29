import { global as globalThis } from '@storybook/global';
// @ts-expect-error This alias is set in the sandbox
// eslint-disable-next-line import/no-unresolved
import { foo } from '#utils';
import { expect, fn, isMockFunction, mocked } from '@storybook/test';

export default {
  component: globalThis.Components.Button,
  args: {
    onClick: fn(),
    label: 'Mock story',
  },
  parameters: {
    chromatic: {
      disable: true,
    },
  },
  loaders: () => {
    mocked(foo).mockReturnValue('mocked');
  },
  async play() {
    await expect(isMockFunction(foo)).toBe(true);
    await expect(foo()).toBe('mocked');
  },
};

export const Basic = {};
