// https://storybook.js.org/docs/react/addons/writing-presets
import { dirname, join } from 'path';
import type { PresetProperty } from '@storybook/core/dist/types';
import type { ConfigItem, PluginItem, TransformOptions } from '@babel/core';
import { loadPartialConfig } from '@babel/core';
import { getProjectRoot } from '@storybook/core/dist/common';
import fs from 'fs';
import semver from 'semver';
import { configureConfig } from './config/webpack';
import { configureCss } from './css/webpack';
import { configureImports } from './imports/webpack';
import { configureStyledJsx } from './styledJsx/webpack';
import { configureImages } from './images/webpack';
import { configureRSC } from './rsc/webpack';
import { configureRuntimeNextjsVersionResolution, getNextjsVersion } from './utils';
import type { FrameworkOptions, StorybookConfig } from './types';
import TransformFontImports from './font/babel';
import { configureNextFont } from './font/webpack/configureNextFont';
import nextBabelPreset from './babel/preset';
import { configureNodePolyfills } from './nodePolyfills/webpack';
import { configureSWCLoader } from './swc/loader';
import { configureBabelLoader } from './babel/loader';
import { configureFastRefresh } from './fastRefresh/webpack';
import { configureAliases } from './aliases/webpack';
import { logger } from '@storybook/core/dist/node-logger';
import { configureNextExportMocks } from './export-mocks/webpack';
import { configureCompatibilityAliases } from './compatibility/compatibility-map';

export const addons: PresetProperty<'addons'> = [
  dirname(require.resolve(join('@storybook/preset-react-webpack', 'package.json'))),
];

export const core: PresetProperty<'core'> = async (config, options) => {
  const framework = await options.presets.apply('framework');

  return {
    ...config,
    builder: {
      name: dirname(
        require.resolve(join('@storybook/builder-webpack5', 'package.json'))
      ) as '@storybook/builder-webpack5',
      options: {
        ...(typeof framework === 'string' ? {} : framework.options.builder || {}),
      },
    },
    renderer: dirname(require.resolve(join('@storybook/react', 'package.json'))),
  };
};

export const previewAnnotations: PresetProperty<'previewAnnotations'> = (
  entry = [],
  { features }
) => {
  const nextDir = dirname(require.resolve('@storybook/nextjs/package.json'));
  const result = [...entry, join(nextDir, 'dist/preview.mjs')];
  return result;
};

export const babel: PresetProperty<'babel'> = async (baseConfig: TransformOptions) => {
  const configPartial = loadPartialConfig({
    ...baseConfig,
    filename: `${getProjectRoot()}/__fake__.js`,
  });

  const options = configPartial?.options;

  const isPresetConfigItem = (preset: any): preset is ConfigItem => {
    return typeof preset === 'object' && preset !== null && 'file' in preset;
  };

  const isNextBabelConfig = (preset: PluginItem) =>
    (Array.isArray(preset) && preset[0] === 'next/babel') ||
    preset === 'next/babel' ||
    (isPresetConfigItem(preset) && preset.file?.request === 'next/babel');

  const hasNextBabelConfig = options?.presets?.find(isNextBabelConfig);

  const presets =
    options?.presets?.filter(
      (preset) =>
        !(
          (isPresetConfigItem(preset) &&
            (preset as ConfigItem).file?.request === require.resolve('@babel/preset-react')) ||
          isNextBabelConfig(preset)
        )
    ) ?? [];

  if (hasNextBabelConfig) {
    if (Array.isArray(hasNextBabelConfig) && hasNextBabelConfig[1]) {
      presets.push([nextBabelPreset, hasNextBabelConfig[1]]);
    } else if (
      isPresetConfigItem(hasNextBabelConfig) &&
      hasNextBabelConfig.file?.request === 'next/babel'
    ) {
      presets.push([nextBabelPreset, hasNextBabelConfig.options]);
    } else {
      presets.push(nextBabelPreset);
    }
  } else {
    presets.push(nextBabelPreset);
  }

  const plugins = [...(options?.plugins ?? []), TransformFontImports];

  return {
    ...options,
    plugins,
    presets,
    babelrc: false,
    configFile: false,
  };
};

export const webpackFinal: StorybookConfig['webpackFinal'] = async (baseConfig, options) => {
  const { nextConfigPath } = await options.presets.apply<FrameworkOptions>('frameworkOptions');
  const nextConfig = await configureConfig({
    baseConfig,
    nextConfigPath,
  });

  const babelRCPath = join(getProjectRoot(), '.babelrc');
  const babelConfigPath = join(getProjectRoot(), 'babel.config.js');
  const hasBabelConfig = fs.existsSync(babelRCPath) || fs.existsSync(babelConfigPath);
  const nextjsVersion = getNextjsVersion();
  const isDevelopment = options.configType !== 'PRODUCTION';

  const isNext14orNewer = semver.gte(nextjsVersion, '14.0.0');
  const useSWC =
    isNext14orNewer && (nextConfig.experimental?.forceSwcTransforms || !hasBabelConfig);

  configureNextFont(baseConfig, useSWC);
  configureRuntimeNextjsVersionResolution(baseConfig);
  configureImports({ baseConfig, configDir: options.configDir });
  configureCss(baseConfig, nextConfig);
  configureImages(baseConfig, nextConfig);
  configureStyledJsx(baseConfig);
  configureNodePolyfills(baseConfig);
  configureAliases(baseConfig);
  configureCompatibilityAliases(baseConfig);
  configureNextExportMocks(baseConfig);

  if (isDevelopment) {
    configureFastRefresh(baseConfig);
  }

  if (options.features?.experimentalRSC) {
    configureRSC(baseConfig);
  }

  if (useSWC) {
    logger.info('=> Using SWC as compiler');
    await configureSWCLoader(baseConfig, options, nextConfig);
  } else {
    logger.info('=> Using Babel as compiler');
    await configureBabelLoader(baseConfig, options);
  }

  return baseConfig;
};
