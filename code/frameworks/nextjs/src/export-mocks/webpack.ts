import { dirname, join } from 'path';
import type { Configuration as WebpackConfig } from 'webpack';

export const configureNextExportMocks = (baseConfig: WebpackConfig): void => {
  const resolve = baseConfig.resolve ?? {};
  const packageLocation = dirname(require.resolve('@storybook/nextjs/package.json'));
  // Use paths for both next/xyz and @storybook/nextjs/xyz imports
  // to make sure they all serve the MJS version of the file
  const headersPath = join(packageLocation, '/dist/export-mocks/headers/index.mjs');
  const navigationPath = join(packageLocation, '/dist/export-mocks/navigation/index.mjs');
  const cachePath = join(packageLocation, '/dist/export-mocks/cache/index.mjs');
  const routerPath = join(packageLocation, '/dist/export-mocks/router/index.mjs');

  resolve.alias = {
    ...resolve.alias,
    // *.actual paths are used as reexports of the original module
    'next/headers.actual': require.resolve('next/headers'),
    'next/headers': headersPath,
    '@storybook/nextjs/headers.mock': headersPath,

    'next/navigation.actual': require.resolve('next/navigation'),
    'next/navigation': navigationPath,
    '@storybook/nextjs/navigation.mock': navigationPath,

    'next/router.actual': require.resolve('next/router'),
    'next/router': routerPath,
    '@storybook/nextjs/router.mock': routerPath,

    'next/cache.actual': require.resolve('next/cache'),
    'next/cache': cachePath,
    '@storybook/nextjs/cache.mock': cachePath,
  };
};
