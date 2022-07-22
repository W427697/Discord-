import path from 'path';
import type { TransformOptions } from '@babel/core';
import type { Configuration } from 'webpack';
import { findDistEsm } from '@storybook/core-common';
import type { StorybookConfig } from '@storybook/core-common';

export function babelDefault(config: TransformOptions): TransformOptions {
  return {
    ...config,
    plugins: [
      [
        require.resolve('@babel/plugin-transform-react-jsx'),
        { importSource: 'preact', runtime: 'automatic' },
      ],
      ...config.plugins,
    ],
  };
}

export function webpackFinal(config: Configuration): Configuration {
  const tsxRule = config.module.rules.find((rule) => (rule.test as RegExp).test?.('main.tsx'));
  tsxRule.use = (tsxRule.use as any).map((entry: any) => {
    let newPlugins = entry.options.plugins;
    if (entry.loader?.includes('babel-loader')) {
      newPlugins = (entry.options as any).plugins.map((plugin: any) => {
        if (plugin[0]?.includes?.('@babel/plugin-transform-react-jsx')) {
          return [plugin[0], { importSource: 'preact', runtime: 'automatic' }];
        }
        return plugin;
      });
    }
    return { ...entry, options: { ...entry.options, plugins: newPlugins } };
  });
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
