import path from 'path';
import { serverRequire } from '@storybook/core-common';

const rspackConfigs = ['rspack.config'];

export const loadCustomRspackConfig = (configDir: string) =>
  serverRequire(rspackConfigs.map((configName) => path.resolve(configDir, configName)));
