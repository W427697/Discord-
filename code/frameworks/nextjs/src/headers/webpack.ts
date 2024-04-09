import { dirname, join } from 'path';
import type { Configuration as WebpackConfig } from 'webpack';

export const configureNextHeaders = (baseConfig: WebpackConfig): void => {
  const resolve = baseConfig.resolve ?? {};
  const headersPath = join(
    dirname(require.resolve('@storybook/nextjs/package.json')),
    '/dist/headers/index.mjs'
  );

  resolve.alias = {
    ...resolve.alias,
    'next/headers': headersPath,
    '@storybook/nextjs/headers': headersPath,
  };
};
