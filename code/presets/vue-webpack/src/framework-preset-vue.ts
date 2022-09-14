/* eslint-disable no-param-reassign */
import { VueLoaderPlugin } from 'vue-loader';

import type { StorybookConfig } from '@storybook/core-webpack';

export const webpack: StorybookConfig['webpack'] = async (config, { presets }) => {
  const typescriptOptions = await presets.apply<StorybookConfig['typescript']>(
    'typescript',
    {} as any
  );

  config.plugins.push(new VueLoaderPlugin());
  config.module.rules.push({
    test: /\.vue$/,
    loader: require.resolve('vue-loader'),
    options: {},
  });
  config.module.rules.push({
    test: /\.ts$/,
    // This exclude & its .tsx counterpart below is a hack
    // for storybook's sandboxing setup, which uses .ts
    // story files that get processed by esbuild-loader.
    // This rule is too permissive, but since we don't know
    // the user's project setup, it's hard to make it specific!
    exclude: [/template-stories/],
    use: [
      {
        loader: require.resolve('ts-loader'),
        options: {
          transpileOnly: !typescriptOptions.check,
          appendTsSuffixTo: [/\.vue$/],
        },
      },
    ],
  });
  config.module.rules.push({
    test: /\.tsx$/,
    exclude: [/template-stories/],
    use: [
      {
        loader: require.resolve('ts-loader'),
        options: {
          transpileOnly: true,
          appendTsxSuffixTo: [/\.vue$/],
        },
      },
    ],
  });

  config.resolve.extensions.push('.vue');
  config.resolve.alias = { ...config.resolve.alias, vue$: require.resolve('vue/dist/vue.esm.js') };

  return config;
};
