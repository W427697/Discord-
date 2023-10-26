import { getProjectRoot } from '@storybook/core-common';
import type { Options } from '@storybook/types';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import type { NextConfig } from 'next';
import { getSupportedBrowsers } from 'next/dist/build/utils';
import { ProfilingPlugin } from 'next/dist/build/webpack/plugins/profiling-plugin';
import { trace } from 'next/dist/trace';
import path from 'path';

export const configureSWCLoader = async (
  baseConfig: any,
  { configType }: Options,
  nextConfig: NextConfig
) => {
  const isDevelopment = configType !== 'PRODUCTION';

  const dir = getProjectRoot();

  baseConfig.plugins = [
    ...baseConfig.plugins,
    new ReactRefreshWebpackPlugin({
      overlay: {
        sockIntegration: 'whm',
      },
    }),
    // new ProfilingPlugin({ runWebpackSpan: trace('Storybook') }),
  ];

  baseConfig.module.rules = [
    ...baseConfig.module.rules,
    {
      test: /\.(m?(j|t)sx?)$/,
      include: [getProjectRoot()],
      exclude: /(node_modules)/,
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
