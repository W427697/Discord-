import type { StorybookConfig } from '@storybook/preset-react-webpack';

export const addons: StorybookConfig['addons'] = [
  '@storybook/preset-react-webpack',
  '@storybook/react',
];

console.log(' LOADED THIS ');

export const core = async (config: StorybookConfig['core']) => {
  return {
    ...config,
    builder: require.resolve('@storybook/builder-webpack5'),
  };
};
