import { getProjectRoot } from '@storybook/core-common';
import type { Options } from '@swc/core';
import type { RuleSetRule } from 'webpack';
import type { TypescriptOptions } from '../types';

export const createSWCLoader = (
  excludes: string[] = [],
  swc: Options,
  typescriptOptions: TypescriptOptions
): RuleSetRule => {
  return {
    test: typescriptOptions.skipCompiler ? /\.(mjs|cjs|jsx?)$/ : /\.(mjs|cjs|tsx?|jsx?)$/,
    use: [
      {
        loader: require.resolve('swc-loader'),
        options: {
          ...swc,
          jsc: {
            ...(swc.jsc ?? {}),
            parser: {
              ...(swc.jsc?.parser ?? {}),
              syntax: 'typescript',
              tsx: true,
              dynamicImport: true,
            },
          },
        },
      },
    ],
    include: [getProjectRoot()],

    exclude: [/node_modules/],
  };
};
