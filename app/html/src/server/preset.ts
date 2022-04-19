import type { Configuration } from 'webpack';
import type { StorybookConfig } from '@storybook/core-common';

export function webpack(config: Configuration) {
  config.module.rules.push({
    test: /\.html$/,
    use: require.resolve('html-loader') as string,
  });

  return config;
}

export const addons: StorybookConfig['addons'] = ['@storybook/renderer-html'];
