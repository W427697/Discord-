import { dirname, join } from 'path';
import { PresetProperty } from '@storybook/types';
import { StorybookConfig } from './types';
import { StandaloneOptions } from './builders/utils/standalone-options';

const getAbsolutePath = <I extends string>(input: I): I =>
  dirname(require.resolve(join(input, 'package.json'))) as any;

export const addons: PresetProperty<'addons', StorybookConfig> = [
  require.resolve('./server/framework-preset-angular-cli'),
  require.resolve('./server/framework-preset-angular-docs'),
];

export const previewAnnotations: StorybookConfig['previewAnnotations'] = (
  entries = []
) => {
  return [...entries, require.resolve('./client/config')];
};

export const core: PresetProperty<'core', StorybookConfig> = async (config, options) => {
  const framework = await options.presets.apply<StorybookConfig['framework']>('framework');

  return {
    ...config,
    builder: {
      name: getAbsolutePath('@storybook/builder-esbuild'),
      options: typeof framework === 'string' ? {} : framework.options.builder || {},
    },
  };
};
