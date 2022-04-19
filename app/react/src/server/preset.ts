import type { StorybookConfig } from '@storybook/core-common';

export const addons: StorybookConfig['addons'] = [
  '@storybook/renderer-react',
  require.resolve('./framework-preset-react'),
  require.resolve('./framework-preset-react-dom-hack'),
  require.resolve('./framework-preset-cra'),
  require.resolve('./framework-preset-react-docs'),
];
