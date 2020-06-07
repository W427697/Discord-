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
    plugins: [
      ...config.plugins,
      [
        require.resolve('@babel/plugin-transform-react-jsx'),
        {},
        // it seems this plugin is already included,
        // but is not applied for some reason
        // if removed it will fail with `Module parse failed: Unexpected token`
        // if added babel will complain about duplicate plugin found
        // and it recommends to use it under another name
        'jsx-transpiler',
      ],
    ],
  };
}
