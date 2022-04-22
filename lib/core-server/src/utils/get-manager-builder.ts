import path from 'path';
import type { Options } from '@storybook/core-common';

export async function getManagerBuilder(configDir: Options['configDir']) {
  const main = path.resolve(configDir, 'main');

  const builderPackage = require.resolve('@storybook/manager-webpack5', { paths: [main] });

  return import(builderPackage);
}
