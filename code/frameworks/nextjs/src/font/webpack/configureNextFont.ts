import type { Configuration } from 'webpack';

export function configureNextFont(baseConfig: Configuration) {
  baseConfig.plugins = [...(baseConfig.plugins || [])];
  const fontLoaderPath = require.resolve('./font/webpack/loader/storybook-nextjs-font-loader');
  baseConfig.module?.rules?.push({
    test: /next\/.*\/target.css$/,
    loader: fontLoaderPath,
  });

  // baseConfig.resolveLoader = {
  //   ...baseConfig.resolveLoader,
  //   alias: {
  //     ...baseConfig.resolveLoader?.alias,
  //     'storybook-nextjs-font-loader': require.resolve(fontLoaderPath),
  //   },
  // };
}
