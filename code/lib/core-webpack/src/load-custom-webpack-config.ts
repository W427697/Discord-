import path from 'path';
import { serverRequire } from '@junk-temporary-prototypes/core-common';

const webpackConfigs = ['webpack.config', 'webpackfile'];

export const loadCustomWebpackConfig = (configDir: string) =>
  serverRequire(webpackConfigs.map((configName) => path.resolve(configDir, configName)));
