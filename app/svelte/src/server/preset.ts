import type { StorybookConfig } from '@storybook/core-common';

export const addons: StorybookConfig['addons'] = [
  '@storybook/preset-svelte-webpack',
  '@storybook/renderer-svelte',
];
