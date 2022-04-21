import type { StorybookConfig } from '@storybook/core-common';

export const addons: StorybookConfig['addons'] = [
  '@storybook/renderer-svelte',
  require.resolve('./framework-preset-svelte'),
  require.resolve('./framework-preset-svelte-docs'),
];
