import { getProjectRoot } from '@storybook/core-common';
import { getVirtualModules } from '@storybook/builder-webpack5';
import type { Options } from '@storybook/types';
import type { NextConfig } from 'next';
import path from 'path';
import type { RuleSetRule } from 'webpack';

export const configureSWCLoader = async (
  baseConfig: any,
  options: Options,
  nextConfig: NextConfig
) => {
  const isDevelopment = options.configType !== 'PRODUCTION';

  const dir = getProjectRoot();

  const { virtualModules } = await getVirtualModules(options);

  baseConfig.module.rules = [
    // TODO: Remove filtering in Storybook 8.0
    ...baseConfig.module.rules.filter((r: RuleSetRule) => {
      return !r.loader?.includes('swc-loader');
    }),
    {
      test: /\.(m?(j|t)sx?)$/,
      include: [getProjectRoot()],
      exclude: [/(node_modules)/, ...Object.keys(virtualModules)],
      enforce: 'post',
      use: {
        // we use our own patch because we need to remove tracing from the original code
        // which is not possible otherwise
        loader: require.resolve('./swc/next-swc-loader-patch.js'),
        options: {
          isServer: false,
          rootDir: dir,
          pagesDir: `${dir}/pages`,
          appDir: `${dir}/apps`,
          hasReactRefresh: false,
          nextConfig,
          supportedBrowsers: require('next/dist/build/utils').getSupportedBrowsers(
            dir,
            isDevelopment
          ),
          swcCacheDir: path.join(dir, nextConfig?.distDir ?? '.next', 'cache', 'swc'),
          bundleTarget: 'default',
        },
      },
    },
  ];
};
