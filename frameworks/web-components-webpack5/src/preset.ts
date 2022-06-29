import type { StorybookConfig } from './types';

export const addons: StorybookConfig['addons'] = [
  '@storybook/preset-web-components-webpack',
  '@storybook/web-components',
];

export const core = async (config: StorybookConfig['core']) => {
  return {
    ...config,
    builder: require.resolve('@storybook/builder-webpack5'),
  };
};
