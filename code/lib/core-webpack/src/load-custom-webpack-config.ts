import path from 'path';
import { serverRequire } from '@storybook/core-api';

const webpackConfigs = ['webpack.config', 'webpackfile'];

export const loadCustomWebpackConfig = (configDir: string) =>
  serverRequire(webpackConfigs.map((configName) => path.resolve(configDir, configName)));
