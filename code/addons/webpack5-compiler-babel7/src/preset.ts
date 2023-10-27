import { getVirtualModuleMapping, type StorybookConfig } from '@storybook/core-webpack';
import type { Configuration } from 'webpack';
import { getProjectRoot } from '@storybook/core-common';
import type { Options } from '@storybook/types';

export const webpackFinal: StorybookConfig['webpackFinal'] = async (
  config: Configuration,
  options: Options
) => {
  const virtualModuleMapping = await getVirtualModuleMapping(options);
  const excludes = Object.keys(virtualModuleMapping);
  const typescriptOptions = await options.presets.apply<{ skipCompiler?: boolean }>(
    'typescript',
    {},
    options
  );
  const babelOptions = await options.presets.apply('babel', {}, options);

  return {
    ...config,
    module: {
      ...config.module,
      rules: [
        ...(config.module?.rules ?? []),
        {
          test: typescriptOptions.skipCompiler ? /\.(mjs|cjs|jsx?)$/ : /\.(mjs|cjs|tsx?|jsx?)$/,
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: {
                ...babelOptions,
                overrides: [
                  ...(babelOptions?.overrides || []),
                  {
                    test: /\.(story|stories).*$/,
                    plugins: [require.resolve('babel-plugin-named-exports-order')],
                  },
                ],
              },
            },
          ],
          include: [getProjectRoot()],
          exclude: [/node_modules/, ...excludes],
        },
      ],
    },
  };
};
