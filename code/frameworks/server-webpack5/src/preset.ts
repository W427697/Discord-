import { dirname, join } from 'path';
import type { PresetProperty } from '@storybook/types';
import type { StorybookConfig } from './types';

const wrapForPnP = <I extends string>(input: I): I =>
  dirname(require.resolve(join(input, 'package.json'))) as I;

export const addons: PresetProperty<'addons', StorybookConfig> = [
  wrapForPnP('@storybook/preset-server-webpack'),
];

export const core: PresetProperty<'core', StorybookConfig> = async (config, options) => {
  const framework = await options.presets.apply<StorybookConfig['framework']>('framework');

  return {
    ...config,
    builder: {
      name: wrapForPnP('@storybook/builder-webpack5'),
      options: typeof framework === 'string' ? {} : framework.options.builder || {},
    },
    renderer: wrapForPnP('@storybook/server'),
  };
};
