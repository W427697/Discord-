import { VueLoaderPlugin } from 'vue-loader';
import { DefinePlugin } from 'webpack';
import type { StorybookConfig } from '@storybook/core-webpack';

export const webpack: StorybookConfig['webpack'] = (config) => {
  return {
    ...config,
    plugins: [
      ...config.plugins,
      new VueLoaderPlugin(),
      new DefinePlugin({
        __VUE_OPTIONS_API__: JSON.stringify(true),
        __VUE_PROD_DEVTOOLS__: JSON.stringify(true),
      }),
    ],
    module: {
      ...config.module,
      rules: [
        ...config.module.rules,
        {
          test: /\.vue$/,
          loader: require.resolve('vue-loader'),
          options: {},
        },
        {
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
                transpileOnly: true,
                appendTsSuffixTo: [/\.vue$/],
              },
            },
          ],
        },
        {
          test: /\.tsx$/,
          exclude: [/template-stories/],
          use: [
            {
              loader: require.resolve('ts-loader'),
              options: {
                transpileOnly: true,
                // Note this is different from the `appendTsSuffixTo` above!
                appendTsxSuffixTo: [/\.vue$/],
              },
            },
          ],
        },
      ],
    },
    resolve: {
      ...config.resolve,
      extensions: [...config.resolve.extensions, '.vue'],
      alias: {
        ...config.resolve.alias,
        vue$: require.resolve('vue/dist/vue.esm-bundler.js'),
      },
    },
  };
};
