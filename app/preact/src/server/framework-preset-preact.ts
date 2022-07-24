import path from 'path';
import type { ConfigItem, PluginItem, TransformOptions } from '@babel/core';
import type { Configuration } from 'webpack';
import { findDistEsm } from '@storybook/core-common';
import type { StorybookConfig } from '@storybook/core-common';

const isMatchingPlugin = (name: string) => (item: PluginItem) => {
  if (!item) return false;
  if (typeof item == 'string') return item.includes(name);
  if (Array.isArray(item)) {
    if (typeof item[0] == 'string') return item.includes(name);
  }
  if ((item as ConfigItem).name) {
    return (item as ConfigItem).name.includes(name);
  }
};

export function babelDefault(config: TransformOptions): TransformOptions {
  return {
    ...config,
    plugins: [
      ...config.plugins.filter(isMatchingPlugin('@babel/plugin-transform-react-jsx')),
      [
        require.resolve('@babel/plugin-transform-react-jsx'),
        { importSource: 'preact', runtime: 'automatic' },
        'preset',
      ],
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
        'react/jsx-runtime': path.dirname(require.resolve('preact/jsx-runtime/package.json')),
      },
    },
  };
}

export const previewAnnotations: StorybookConfig['previewAnnotations'] = (entry = []) => {
  return [...entry, findDistEsm(__dirname, 'client/preview/config')];
};
