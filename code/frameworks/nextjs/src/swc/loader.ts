import { getProjectRoot } from '@storybook/core-common';
import { getVirtualModuleMapping } from '@storybook/core-webpack';
import type { Options } from '@storybook/types';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import type { NextConfig } from 'next';
import { getSupportedBrowsers } from 'next/dist/build/utils';
import path from 'path';

export const configureSWCLoader = async (
  baseConfig: any,
  options: Options,
  nextConfig: NextConfig
) => {
  const isDevelopment = options.configType !== 'PRODUCTION';

  const dir = getProjectRoot();

  baseConfig.plugins = [
    ...baseConfig.plugins,
    new ReactRefreshWebpackPlugin({
      overlay: {
        sockIntegration: 'whm',
      },
    }),
  ];

  const virtualModules = await getVirtualModuleMapping(options);

  baseConfig.module.rules = [
    ...baseConfig.module.rules,
    {
      test: /\.(m?(j|t)sx?)$/,
      include: [getProjectRoot()],
      exclude: [/(node_modules)/, ...Object.keys(virtualModules)],
      use: {
        loader: require.resolve('next/dist/build/webpack/loaders/next-swc-loader.js'),
        options: {
          isServer: false,
          rootDir: dir,
          pagesDir: `${dir}/pages`,
          appDir: `${dir}/apps`,
          hasReactRefresh: isDevelopment,
          hasServerComponents: true,
          nextConfig,
          supportedBrowsers: getSupportedBrowsers(dir, isDevelopment),
          swcCacheDir: path.join(dir, nextConfig?.distDir ?? '.next', 'cache', 'swc'),
          isServerLayer: false,
          bundleTarget: 'default',
        },
      },
    },
  ];
};
