import path from 'path';
import { StorybookConfig } from '@storybook/core-webpack';

export const webpackFinal: StorybookConfig['webpackFinal'] = async (config, options) => {
  const svelteOptions = await options.presets.apply('svelteOptions', {} as any, options);

  config.module.rules.push({
    test: /\.svelte$/,
    loader: path.resolve(`${__dirname}/svelte-docgen-loader`),
    enforce: 'post',
    options: svelteOptions,
  });

  return config;
};
