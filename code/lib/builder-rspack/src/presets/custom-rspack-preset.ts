import * as rspackReal from '@rspack/core';
import { logger } from '@storybook/node-logger';
import type { Options, CoreConfig } from '@storybook/types';
import type { Configuration } from '@rspack/core';
import { loadCustomRspackConfig } from '@storybook/core-rspack';
import { createDefaultRspackConfig } from '../preview/base-rspack.config';

export async function rspack(config: Configuration, options: Options) {
  const { configDir, configType, presets } = options;

  const coreOptions = await presets.apply<CoreConfig>('core');

  let defaultConfig = config;
  if (!coreOptions?.disableWebpackDefaults) {
    defaultConfig = await createDefaultRspackConfig(config, options);
  }

  const finalDefaultConfig = await presets.apply('rspackFinal', defaultConfig, options);

  // Check whether user has a custom webpack config file and
  // return the (extended) base configuration if it's not available.
  const customConfig = loadCustomRspackConfig(configDir);

  if (typeof customConfig === 'function') {
    logger.info('=> Loading custom Rspack config (full-control mode).');
    return customConfig({ config: finalDefaultConfig, mode: configType });
  }

  logger.info('=> Using default Rspack setup');
  return finalDefaultConfig;
}

export const rspackInstance = async () => rspackReal;
