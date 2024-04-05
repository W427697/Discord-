import type { Configuration as WebpackConfig } from 'webpack';

export const configureNextHeaders = (baseConfig: WebpackConfig): void => {
  const resolve = baseConfig.resolve ?? {};
  resolve.alias = {
    ...resolve.alias,
    'next/headers': require.resolve('@storybook/nextjs/headers'),
  };
};
