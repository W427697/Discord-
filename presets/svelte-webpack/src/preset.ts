import type { StorybookConfig } from '@storybook/webpack-tools';

export const addons: StorybookConfig['addons'] = [
  require.resolve('./framework-preset-svelte'),
  require.resolve('./framework-preset-svelte-docs'),
];
