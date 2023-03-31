/* eslint-disable no-param-reassign */

import { dirname, join } from 'path';
import type { PresetProperty, Options } from '@storybook/types';
import type { FrameworkOptions, StorybookConfig } from './types';

const wrapForPnP = (input: string) => dirname(require.resolve(join(input, 'package.json')));

export const addons: PresetProperty<'addons', StorybookConfig> = [
  wrapForPnP('@storybook/preset-react-rspack'),
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
      name: wrapForPnP('@storybook/react-rspack') as '@storybook/react-rspack',
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
      name: wrapForPnP('@storybook/builder-rspack') as '@storybook/builder-rspack',
      options: typeof framework === 'string' ? {} : framework.options.builder || {},
    },
    renderer: wrapForPnP('@storybook/react'),
  };
};

export const rspack: StorybookConfig['rspack'] = async (config) => {
  config.resolve = config.resolve || {};

  config.resolve.alias = {
    ...config.resolve?.alias,
    '@storybook/react': wrapForPnP('@storybook/react'),
  };
  return config;
};
