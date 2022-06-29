import type { StorybookConfig } from '@storybook/core-webpack';

export const addons: StorybookConfig['addons'] = [
  require.resolve('./framework-preset-svelte'),
  require.resolve('./framework-preset-svelte-docs'),
];
