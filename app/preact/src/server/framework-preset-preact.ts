import path from 'path';
import type { TransformOptions } from '@babel/core';
import type { Configuration } from 'webpack';
import type { StorybookConfig } from '@storybook/core-common';

export function babelDefault(config: TransformOptions): TransformOptions {
  return {
    ...config,
    plugins: [
      ...config.plugins,
      [require.resolve('@babel/plugin-transform-react-jsx'), { pragma: 'h' }, 'preset'],
    ],
  };
}

export function webpackFinal(config: Configuration): Configuration {
  return {
    ...config,
    resolve: {
      ...config.resolve,
      alias: {
        ...config.resolve.alias,
        react: path.dirname(require.resolve('preact/compat/package.json')),
        'react-dom/test-utils': path.dirname(require.resolve('preact/test-utils/package.json')),
        'react-dom': path.dirname(require.resolve('preact/compat/package.json')),
      },
    },
  };
}

export const addons: StorybookConfig['addons'] = ['@storybook/renderer-preact'];
