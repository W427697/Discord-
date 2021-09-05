import * as webpackReal from 'webpack';
import { logger } from '@storybook/node-logger';
import { loadCustomWebpackConfig, Options, CoreConfig } from '@storybook/core-common';
import type { Configuration } from 'webpack';
import deprecate from 'util-deprecate';
import dedent from 'ts-dedent';
import { createDefaultWebpackConfig } from '../preview/base-webpack.config';
import { checkForModuleFederation, enableModuleFederation } from './module-federation';

export async function webpack(config: Configuration, options: Options): Promise<Configuration> {
  // @ts-ignore
  const { configDir, configType, presets, webpackConfig } = options;

  const coreOptions = await presets.apply<CoreConfig>('core');

  let defaultConfig = config;
  if (!coreOptions?.disableWebpackDefaults) {
    defaultConfig = await createDefaultWebpackConfig(config, options);
  }

  const appliedDefaultConfig = await presets.apply('webpackFinal', defaultConfig, options);

  // through standalone webpackConfig option
  if (webpackConfig) {
    return deprecate(
      webpackConfig,
      dedent`
        You've provided a webpack config directly in CallOptions, this is not recommended. Please use presets instead. This feature will be removed in 7.0
      `
    )(appliedDefaultConfig);
  }

  // Check whether user has a custom webpack config file and
  // return the (extended) base configuration if it's not available.
  const customConfig = loadCustomWebpackConfig(configDir);

  let finalDefaultConfig;

  if (typeof customConfig === 'function') {
    logger.info('=> Loading custom Webpack config (full-control mode).');
    finalDefaultConfig = customConfig({ config: appliedDefaultConfig, mode: configType });
  } else {
    logger.info('=> Using default Webpack5 setup');
    finalDefaultConfig = appliedDefaultConfig;
  }

  // Check whether user has added ModuleFederationPlugin
  // If true, create an async barrier, turn off runtimeChunk optimization
  // and remove publicPath if set to empty string
  if (checkForModuleFederation(finalDefaultConfig)) {
    return enableModuleFederation(finalDefaultConfig);
  }

  return finalDefaultConfig;
}

export const webpackInstance = async () => webpackReal;
export const webpackVersion = async () => '5';
