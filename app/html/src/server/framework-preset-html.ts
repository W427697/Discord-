// eslint-disable-next-line import/no-extraneous-dependencies
import type { Configuration } from 'webpack';

// @ts-ignore
export function webpack(config: Configuration) {
  return {
    ...config,
    module: {
      ...config.module,
      rules: [
        ...config.module.rules,
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
