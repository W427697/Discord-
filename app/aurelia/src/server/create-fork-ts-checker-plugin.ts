import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import { logger } from '@storybook/node-logger';

import { Options } from 'ts-loader';

export default function (tsLoaderOptions: Partial<Options>) {
  if (tsLoaderOptions && tsLoaderOptions.configFile) {
    // this config is busted, read the errors it throws and read the docs / do TS wizardy that i dont understand
    return new ForkTsCheckerWebpackPlugin({
      tsconfig: tsLoaderOptions.configFile,
      async: false,
    });
  }

  logger.info('=> Using default options for ForkTsCheckerWebpackPlugin');
  return new ForkTsCheckerWebpackPlugin();
}
