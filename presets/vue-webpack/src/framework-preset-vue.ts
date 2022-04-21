/* eslint-disable no-param-reassign */
import { VueLoaderPlugin } from 'vue-loader';

import type { TypescriptConfig, StorybookConfig } from '@storybook/core-common';

export const webpack: StorybookConfig['webpack'] = async (config, { presets }) => {
  const typescriptOptions = await presets.apply<TypescriptConfig>('typescript', {} as any);

  config.plugins.push(new VueLoaderPlugin());
  config.module.rules.push({
    test: /\.vue$/,
    loader: require.resolve('vue-loader'),
    options: {},
  });
  config.module.rules.push({
    test: /\.ts$/,
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
