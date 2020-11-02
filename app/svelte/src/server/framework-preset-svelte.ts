// import { Configuration } from 'webpack';
import type { StorybookOptions } from '@storybook/core/types';

type Configuration = any;

export async function webpack(config: Configuration, options: StorybookOptions) {
  return {
    ...config,
    module: {
      ...config.module,
      rules: [
        ...config.module.rules,
        {
          test: /\.(svelte|html)$/,
          loader: require.resolve('svelte-loader'),
          options: {},
        },
      ],
    },
    resolve: {
      ...config.resolve,
      extensions: [...config.resolve.extensions, '.svelte'],
      alias: config.resolve.alias,
    },
  };
}
