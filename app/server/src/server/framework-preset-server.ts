import path from 'path';

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
          type: 'javascript/auto',
          test: /\.stories\.json$/,
          use: [
            {
              loader: path.resolve(__dirname, './loader.js'),
            },
          ],
        },
      ],
    },
  };
}
