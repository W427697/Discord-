import path from 'path';
import type { StorybookConfig } from '@storybook/core-webpack';

export const webpackFinal: StorybookConfig['webpackFinal'] = async (config, options) => {
  const svelteOptions = await options.presets.apply('svelteOptions', {} as any, options);

  const rules = [
    ...(config.module?.rules || []),
    {
      test: /\.svelte$/,
      loader: path.resolve(`${__dirname}/svelte-docgen-loader`),
      enforce: 'post',
      options: svelteOptions,
    },
  ];

  // eslint-disable-next-line no-param-reassign
  config.module = config.module || {};
  // eslint-disable-next-line no-param-reassign
  config.module.rules = rules;

  return config;
};
