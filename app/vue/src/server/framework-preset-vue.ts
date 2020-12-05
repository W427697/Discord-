/* eslint-disable global-require */
import { Configuration } from 'webpack';
import { vueVersion } from '../vue-version';

function getVueLoaderPlugin() {
  const vueLoader = require('vue-loader');
  return vueLoader.VueLoaderPlugin || require('vue-loader/lib/plugin').default;
}

export function webpack(config: Configuration) {
  return {
    ...config,
    plugins: [...config.plugins, new (getVueLoaderPlugin())()],
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
        vue$:
          vueVersion === 2 ? require.resolve('vue/dist/vue.esm.js') : 'vue/dist/vue.esm-bundler.js',
      },
    },
  };
}
