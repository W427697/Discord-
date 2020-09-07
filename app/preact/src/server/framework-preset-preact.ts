import path from 'path';
import { TransformOptions } from '@babel/core';
import { Configuration } from 'webpack'; // eslint-disable-line

export function babelDefault(config: TransformOptions) {
  return {
    ...config,
    plugins: [
      ...config.plugins,
      [require.resolve('@babel/plugin-transform-react-jsx'), { pragma: 'h' }, 'preset'],
    ],
  };
}

export function webpackFinal(config: Configuration) {
  return {
    ...config,
    resolve: {
      ...config.resolve,
      // Prefer top-level aliases
      modules: [path.resolve('node_modules'), ...config.resolve.modules],
      // Alias react imports to "preact/compat":
      alias: {
        ...config.resolve.alias,
        react: 'preact/compat',
        'react-dom': 'preact/compat',
      },
    },
  };
}
