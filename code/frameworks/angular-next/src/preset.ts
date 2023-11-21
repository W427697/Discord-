import { PresetProperty } from '@storybook/types';
import { StorybookConfig } from './types';

export const addons: PresetProperty<'addons', StorybookConfig> = [
  require.resolve('./server/framework-preset-angular-docs'),
];

export const previewAnnotations: StorybookConfig['previewAnnotations'] = (entries = []) => {
  return [...entries, require.resolve('./client/config')];
};

export const core: PresetProperty<'core', StorybookConfig> = async (config, options) => {
  const framework = await options.presets.apply<StorybookConfig['framework']>('framework');

  return {
    ...config,
    builder: {
      // TODO use local builder
      name: require.resolve('./esbuild/index'),
      options: typeof framework === 'string' ? {} : framework.options.builder || {},
    },
  };
};
