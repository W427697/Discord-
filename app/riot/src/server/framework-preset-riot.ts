import { Configuration } from 'webpack';
import { findDistEsm } from '@storybook/core-common';
import type { StorybookConfig } from '@storybook/core-common';

export function webpack(config: Configuration): Configuration {
  return {
    ...config,
    plugins: [
      ...config.plugins,
    ],
    module: {
      ...config.module,
      rules: [
        ...config.module.rules,
        {
          test: /\.riot$/,
          loader: require.resolve('@riotjs/webpack-loader'),
          options: {},
        },
        {
          test: /\.ts$/,
          use: [
            {
              loader: require.resolve('ts-loader'),
              options: {
                transpileOnly: true,
                appendTsSuffixTo: [/\.riot$/],
              },
            },
          ],
        },
        {
          test: /\.tsx$/,
          use: [
            {
              loader: require.resolve('ts-loader'),
              options: {
                transpileOnly: true,
                // Note this is different from the `appendTsSuffixTo` above!
                appendTsxSuffixTo: [/\.riot$/],
              },
            },
          ],
        },
      ],
    },
    resolve: {
      ...config.resolve,
      extensions: [...config.resolve.extensions, '.riot'],
      alias: {
        ...config.resolve.alias,
        riot$: require.resolve('riot/riot.esm.js'),
        '@riotjs/compiler': require.resolve('@riotjs/compiler/dist/compiler.essential.js')
      },
    },
  };
}

export const previewAnnotations: StorybookConfig['previewAnnotations'] = (entry = []) => {
  return [...entry, findDistEsm(__dirname, 'client/preview/config')];
};
