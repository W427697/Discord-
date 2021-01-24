// eslint-disable-next-line import/no-extraneous-dependencies
import { Configuration } from 'webpack';
// import { AngularCompilerPlugin } from '@ngtools/webpack';
// import path from 'path';

import createForkTsCheckerInstance from './create-fork-ts-checker-plugin';
import getTsLoaderOptions from './ts_config';

export function webpack(config: Configuration, { configDir }: { configDir: string }) {
  const tsLoaderOptions = getTsLoaderOptions(configDir);
  return {
    ...config,
    module: {
      ...config.module,
      rules: [
        ...config.module.rules,

        {
          test: /\.ts$/i,
          use: [{ loader: require.resolve('ts-loader'), options: tsLoaderOptions }],
          exclude: /node_modules/,
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: require.resolve('html-loader'),
            },
          ],
        },
        // {
        //   test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
        //   loader: '@ngtools/webpack',
        // },
        // {
        //   test: /\.scss$/,
        //   use: ['raw-loader', 'sass-loader'],
        // },
        // { test: /\.css$/, loader: 'raw-loader' },
        // { test: /\.html$/, loader: 'raw-loader' },
      ],
    },

    plugins: [
      ...config.plugins,
      createForkTsCheckerInstance(tsLoaderOptions),

      // new AngularCompilerPlugin({
      //   tsConfigPath: tsLoaderOptions.configFile,
      //   sourceMap: true,
      // }),
    ],
  };
}
