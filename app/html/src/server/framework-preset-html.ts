// import { Configuration } from 'webpack';
import type { StorybookOptions } from '@storybook/core/types';

type Configuration = any;

export async function webpack(config: Configuration, options: StorybookOptions) {
  return {
    ...config,
    module: {
      ...config.module,
      rules: [
        ...[].concat(config.module.rules),
        {
          test: /\.html$/,
          use: [
            {
              loader: require.resolve('html-loader'),
            },
          ],
        },
      ],
    },
  };
}
