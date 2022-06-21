import path from 'path';
import type { Preset } from '@storybook/core-webpack';
import type { StorybookConfig, SvelteOptions } from './types';

export const webpackFinal: StorybookConfig['webpackFinal'] = async (config, { presets }) => {
  const framework = await presets.apply<Preset>('framework');
  const svelteOptions = (typeof framework === 'object' ? framework.options : {}) as SvelteOptions;

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
