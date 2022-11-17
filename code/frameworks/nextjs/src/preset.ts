// https://storybook.js.org/docs/react/addons/writing-presets
import { dirname, join } from 'path';
import semver from 'semver';
import type { Options, PresetProperty } from '@storybook/types';
import type { TransformOptions } from '@babel/core';
import { configureConfig } from './config/webpack';
import { configureCss } from './css/webpack';
import { configureImports } from './imports/webpack';
import { configureRouting } from './routing/webpack';
import { configureStyledJsx } from './styledJsx/webpack';
import { configureStyledJsxTransforms } from './styledJsx/babel';
import { configureImages } from './images/webpack';
import { configureRuntimeNextjsVersionResolution, getNextjsVersion } from './utils';
import type { FrameworkOptions, StorybookConfig } from './types';
import { configureTypescript } from './config/babel';

export const addons: PresetProperty<'addons', StorybookConfig> = [
  dirname(require.resolve(join('@storybook/preset-react-webpack', 'package.json'))),
  dirname(require.resolve(join('@storybook/builder-webpack5', 'package.json'))),
];

const version = getNextjsVersion();

const defaultFrameworkOptions: FrameworkOptions = {};

export const frameworkOptions = async (
  _: never,
  options: Options
): Promise<StorybookConfig['framework']> => {
  const config = await options.presets.apply<StorybookConfig['framework']>('framework');

  if (typeof config === 'string') {
    return {
      name: config,
      options: defaultFrameworkOptions,
    };
  }
  if (typeof config === 'undefined') {
    return {
      name: require.resolve('@storybook/nextjs') as '@storybook/nextjs',
      options: defaultFrameworkOptions,
    };
  }

  return {
    name: config.name,
    options: {
      ...defaultFrameworkOptions,
      ...config.options,
    },
  };
};

export const core: PresetProperty<'core', StorybookConfig> = async (config, options) => {
  const framework = await options.presets.apply<StorybookConfig['framework']>('framework');

  return {
    ...config,
    builder: {
      name: dirname(
        require.resolve(join('@storybook/builder-webpack5', 'package.json'))
      ) as '@storybook/builder-webpack5',
      options: typeof framework === 'string' ? {} : framework.options.builder || {},
    },
    renderer: dirname(require.resolve(join('@storybook/react', 'package.json'))),
  };
};

export const config: StorybookConfig['previewAnnotations'] = (entry = []) => [
  ...entry,
  require.resolve('@storybook/nextjs/preview.js'),
];

export const env = (envConfig: PresetProperty<'env', StorybookConfig>) => {
  return {
    ...envConfig,
    // Can be removed if https://github.com/vercel/next.js/issues/42621 is resolved
    ...(semver.gte(version, '13.0.0') && {
      // TODO: This should also respect `newNextLinkBehavior`: https://github.com/vercel/next.js/blob/07d3da102dfef65be9c13fd4b754a12eda7eded1/packages/next/server/config-shared.ts#L88
      __NEXT_NEW_LINK_BEHAVIOR: 'true',
    }),
  };
};

// Not even sb init - automigrate - running dev
// You're using a version of Nextjs prior to v10, which is unsupported by this framework.

export const babel = async (baseConfig: TransformOptions): Promise<TransformOptions> => {
  configureTypescript(baseConfig);
  configureStyledJsxTransforms(baseConfig);

  return baseConfig;
};

export const webpackFinal: StorybookConfig['webpackFinal'] = async (baseConfig, options) => {
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const frameworkOptions = await options.presets.apply<{ options: FrameworkOptions }>(
    'frameworkOptions'
  );
  const { options: { nextConfigPath } = {} } = frameworkOptions;
  const nextConfig = await configureConfig({
    baseConfig,
    nextConfigPath,
    configDir: options.configDir,
  });

  configureRuntimeNextjsVersionResolution(baseConfig);
  configureImports(baseConfig);
  configureCss(baseConfig, nextConfig);
  configureImages(baseConfig);
  configureRouting(baseConfig);
  configureStyledJsx(baseConfig);

  return baseConfig;
};
