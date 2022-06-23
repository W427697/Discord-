import type { StorybookConfig } from './types';

export * from './types';

export const addons: StorybookConfig['addons'] = [
  require.resolve('@storybook/react-webpack5/dist/framework-preset-react'),
  require.resolve('@storybook/react-webpack5/dist/framework-preset-react-dom-hack'),
  require.resolve('@storybook/react-webpack5/dist/framework-preset-cra'),
  require.resolve('@storybook/react-webpack5/dist/framework-preset-react-docs'),
];
