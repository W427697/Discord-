import type { StorybookConfig } from '@storybook/types';

export const addons: StorybookConfig['addons'] = [
  // Can't use path in this file due to be compiled for browser, this is a workaround
  require.resolve('@storybook/react-dom-shim/package.json').replace('package.json', ''),
];
