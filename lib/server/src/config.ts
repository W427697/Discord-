import path from 'path';

import { getStorybookConfigs } from '@storybook/config';

import { getPresets, applyPresets } from './presets';

import * as manager from './manager/webpack.config';
import * as preview from './preview/webpack.config';

import {
  ConfigPrefix,
  BuildConfig,
  CliOptions,
  CallOptions,
  StorybookConfig,
  EnvironmentType,
  Preset,
  OutputConfig,
} from './types';

const get = async (
  type: ConfigPrefix,
  env: EnvironmentType,
  config: StorybookConfig,
  output: OutputConfig
) => {
  if (type === 'manager') {
    const baseWebpack = await manager.createBaseWebpackConfig(env, output, config.entries);
    return {
      babel: config.managerBabel,
      webpack: async () => config.managerWebpack(baseWebpack, env),
      template: config.managerTemplate,
    };
  }
  if (type === 'preview') {
    const baseWebpack = await preview.createBaseWebpackConfig(env, output, config.entries);

    return {
      babel: config.babel,
      webpack: () => config.webpack(baseWebpack, env),
      template: config.template,
    };
  }
  return {};
};

const createOutputConfig = (
  storybookConfig: StorybookConfig,
  fromCli: CliOptions
): OutputConfig => {
  const defaultLocation = path.join(process.cwd(), 'storybook-out');
  if (storybookConfig.output) {
    return {
      location: fromCli.outputDir || storybookConfig.output.location || defaultLocation,
      compress: storybookConfig.output.compress || false,
    };
  }
  return {
    location: fromCli.outputDir || defaultLocation,
    compress: false,
  };
};

const createBuildConfig = async (
  type: ConfigPrefix,
  env: EnvironmentType,
  cliOptions: CliOptions,
  callOptions: CallOptions,
  additionalPresets?: Preset[]
): Promise<BuildConfig> => {
  // load the user's config
  const configsFiles = await getStorybookConfigs();

  // TODO: add dll based on cli

  // load relevant config from storybook.config.js
  const base: StorybookConfig = await import(configsFiles.node.location);

  const presets = getPresets(base, callOptions, additionalPresets);

  // recurse over all presets to create the main config
  const storybookConfig = await applyPresets(presets, base);

  const outputConfig = createOutputConfig(storybookConfig, cliOptions);

  return {
    entries: [...(storybookConfig.entries || [])],
    addons: [...(storybookConfig.entries || [])],
    logLevel: cliOptions.debugWebpack
      ? 'verbose'
      : cliOptions.logLevel || storybookConfig.logLevel || 'info',
    configFile: configsFiles[type],
    output: outputConfig,
    ...(await get(type, env, storybookConfig, outputConfig)),
  };
};

export { createBuildConfig };
