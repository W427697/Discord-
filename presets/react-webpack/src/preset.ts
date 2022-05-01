import type { StorybookConfig } from '@storybook/webpack-tools';

export const addons: StorybookConfig['addons'] = [
  require.resolve('./framework-preset-react'),
  require.resolve('./framework-preset-react-dom-hack'),
  require.resolve('./framework-preset-cra'),
  require.resolve('./framework-preset-react-docs'),
];
