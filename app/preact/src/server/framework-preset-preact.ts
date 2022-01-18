import path from 'path';
import { TransformOptions } from '@babel/core';
import { Configuration } from 'webpack';
import type { StorybookConfig } from '@storybook/core-common';
import { findDistEsm } from '@storybook/core-common';

export async function babelDefault(config: TransformOptions): Promise<any> {
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
      alias: {
        ...config.resolve.alias,
        react: path.dirname(require.resolve('preact/compat/package.json')),
        'react-dom/test-utils': path.dirname(require.resolve('preact/test-utils/package.json')),
        'react-dom': path.dirname(require.resolve('preact/compat/package.json')),
      },
    },
  };
}

export const config: StorybookConfig['config'] = (entry = []) => {
  return [...entry, findDistEsm(__dirname, 'client/preview/config')];
};
