import type { StorybookConfig } from '@storybook/core-common';

export const webpack: StorybookConfig['webpack'] = (config) => {
  config.module.rules.push({
    test: /\.html$/,
    use: require.resolve('html-loader') as string,
  });

  return config;
};
