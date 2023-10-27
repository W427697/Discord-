import TerserWebpackPlugin from 'terser-webpack-plugin';
import { getProjectRoot } from '@storybook/core-common';
import { getVirtualModuleMapping, type StorybookConfig } from '@storybook/core-webpack';

export const webpackFinal: StorybookConfig['webpackFinal'] = async (config, options) => {
  const isProd = options.configType === 'PRODUCTION';
  const swc = await options.presets.apply('swc', {}, options);
  const typescriptOptions = await options.presets.apply<{ skipCompiler?: boolean }>(
    'typescript',
    {},
    options
  );
  const virtualModuleMapping = await getVirtualModuleMapping(options);
  const excludes = Object.keys(virtualModuleMapping);

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

          exclude: [/node_modules/, ...excludes],
        },
      ],
    },
    optimization: isProd
      ? {
          ...(config.optimization ?? {}),
          minimizer: [
            new TerserWebpackPlugin({
              minify: TerserWebpackPlugin.swcMinify,
              terserOptions: {
                sourceMap: true,
                mangle: false,
                keep_fnames: true,
              },
            }),
          ],
        }
      : config.optimization,
  };
};
