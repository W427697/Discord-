import type { StorybookConfig } from '@storybook/core-common';

export const addons: StorybookConfig['addons'] = [
  '@storybook/preset-web-components-webpack',
  '@storybook/renderer-web-components',
];
