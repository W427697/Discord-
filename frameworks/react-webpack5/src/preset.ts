import type { StorybookConfig } from '@storybook/preset-react-webpack';
import path from 'path';

export const addons: StorybookConfig['addons'] = [
  path.dirname(require.resolve(path.join('@storybook/preset-react-webpack', 'package.json'))),
  path.dirname(require.resolve(path.join('@storybook/react', 'package.json'))),
];

export const core = async (config: StorybookConfig['core']) => {
  return {
    ...config,
    builder: path.dirname(
      require.resolve(path.join('@storybook/builder-webpack5', 'package.json'))
    ),
  };
};

export const webpack: StorybookConfig['webpack'] = async (config) => {
  // eslint-disable-next-line no-param-reassign
  config.resolve = config.resolve || {};

  // eslint-disable-next-line no-param-reassign
  config.resolve.alias = {
    ...config.resolve?.alias,
    '@storybook/react': path.dirname(
      require.resolve(path.join('@storybook/react', 'package.json'))
    ),
  };
  return config;
};
