import path from 'path';
import { serverRequire } from '@storybook/core/dist/modules/core-common/index';

const webpackConfigs = ['webpack.config', 'webpackfile'];

export const loadCustomWebpackConfig = (configDir: string) =>
  serverRequire(webpackConfigs.map((configName) => path.resolve(configDir, configName)));
