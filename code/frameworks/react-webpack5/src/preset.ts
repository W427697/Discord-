/* eslint-disable no-param-reassign */

import { dirname, join } from 'path';
import type { PresetProperty, Options } from '@junk-temporary-prototypes/types';
import type { FrameworkOptions, StorybookConfig } from './types';

const wrapForPnP = (input: string) => dirname(require.resolve(join(input, 'package.json')));

export const addons: PresetProperty<'addons', StorybookConfig> = [
  wrapForPnP('@junk-temporary-prototypes/preset-react-webpack'),
];

const defaultFrameworkOptions: FrameworkOptions = {
  legacyRootApi: true,
};

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
      name: wrapForPnP('@junk-temporary-prototypes/react-webpack5') as '@junk-temporary-prototypes/react-webpack5',
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
      name: wrapForPnP('@junk-temporary-prototypes/builder-webpack5') as '@junk-temporary-prototypes/builder-webpack5',
      options: typeof framework === 'string' ? {} : framework.options.builder || {},
    },
    renderer: wrapForPnP('@junk-temporary-prototypes/react'),
  };
};

export const webpack: StorybookConfig['webpack'] = async (config) => {
  config.resolve = config.resolve || {};

  config.resolve.alias = {
    ...config.resolve?.alias,
    '@junk-temporary-prototypes/react': wrapForPnP('@junk-temporary-prototypes/react'),
  };
  return config;
};
