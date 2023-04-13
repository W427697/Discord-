import { getProjectRoot } from '@storybook/core-common';
import type { Options } from '@swc/core';
import type { TypescriptOptions } from '../types';

export const createBabelLoader = (options: any, typescriptOptions: TypescriptOptions) => {
  return {
    test: typescriptOptions.skipBabel ? /\.(mjs|jsx?)$/ : /\.(mjs|tsx?|jsx?)$/,
    use: [
      {
        loader: require.resolve('babel-loader'),
        options,
      },
    ],
    include: [getProjectRoot()],
    exclude: /node_modules/,
  };
};

export const createSWCLoader = (options: any) => {
  const config: Options = {
    jsc: {
      parser: {
        syntax: 'typescript',
        tsx: true,
        dynamicImport: true,
      },
    },
  };
  return {
    test: /\.(mjs|cjs|tsx?|jsx?)$/,
    use: [
      {
        loader: require.resolve('swc-loader'),
        options: {
          ...config,
          ...options,
        },
      },
    ],
    include: [getProjectRoot()],
    exclude: /node_modules/,
  };
};
