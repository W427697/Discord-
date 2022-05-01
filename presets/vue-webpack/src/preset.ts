import type { StorybookConfig } from '@storybook/webpack-tools';

export const addons: StorybookConfig['addons'] = [
  require.resolve('./framework-preset-vue'),
  require.resolve('./framework-preset-vue-docs'),
];
