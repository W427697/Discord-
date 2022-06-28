import type { StorybookConfig } from '@storybook/core-webpack';

export const webpack: StorybookConfig['webpack'] = (config) => {
  const rules = [
    ...(config.module?.rules || []),
    {
      test: /\.html$/,
      use: require.resolve('html-loader') as string,
    },
  ];

  // eslint-disable-next-line no-param-reassign
  config.module = config.module || {};
  // eslint-disable-next-line no-param-reassign
  config.module.rules = rules;

  return config;
};
