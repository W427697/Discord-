import path from 'path';

import { Options, StorybookConfig } from '@storybook/core-common';

type Configuration = any;

export async function webpackFinal(webpackConfig: Configuration, options: Options) {
  const svelteOptions = await options.presets.apply('svelteOptions', {} as any, options);

  webpackConfig.module.rules.push({
    test: /\.svelte$/,
    loader: path.resolve(`${__dirname}/svelte-docgen-loader`),
    enforce: 'post',
    options: svelteOptions,
  });

  return webpackConfig;
}

export const previewAnnotations: StorybookConfig['previewAnnotations'] = (entry = []) => {
  return [...entry, require.resolve('@storybook/renderer-svelte/dist/esm/docs/config')];
};
