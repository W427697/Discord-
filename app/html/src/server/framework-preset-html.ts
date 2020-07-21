// eslint-disable-next-line import/no-extraneous-dependencies
import { Configuration } from 'webpack';
import { TransformOptions } from '@babel/core';

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

export function babelDefault(config: TransformOptions) {
  return {
    ...config,
    plugins: [...config.plugins, ['@babel/plugin-transform-react-jsx', {}, 'jsx-to-dom']],
  };
}
