import { VueLoaderPlugin } from 'vue-loader';
import { findDistEsm } from '@storybook/core-common';
import type { Options, StorybookConfig } from '@storybook/core-common';
import type { Configuration } from 'webpack';

export async function webpack(config: Configuration, options: Options) {
  const webpackInstance = await options.presets.apply<any>('webpackInstance', options);
  return {
    ...config,
    plugins: [
      ...config.plugins,
      new VueLoaderPlugin(),
      new webpackInstance.DefinePlugin({
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
          test: /\.tsx?$/,
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
}

export const config: StorybookConfig['config'] = (entry = []) => {
  return [...entry, findDistEsm(__dirname, 'client/preview/config')];
};
