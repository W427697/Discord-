import { dirname, join } from 'path';
import type { PresetProperty } from '@junk-temporary-prototypes/types';
import type { StorybookConfig } from './types';

const wrapForPnP = (input: string) => dirname(require.resolve(join(input, 'package.json')));

export const addons: PresetProperty<'addons', StorybookConfig> = [
  wrapForPnP('@junk-temporary-prototypes/preset-vue3-webpack'),
];

export const core: PresetProperty<'core', StorybookConfig> = async (config, options) => {
  const framework = await options.presets.apply<StorybookConfig['framework']>('framework');

  return {
    ...config,
    builder: {
      name: wrapForPnP('@junk-temporary-prototypes/builder-webpack5') as '@junk-temporary-prototypes/builder-webpack5',
      options: typeof framework === 'string' ? {} : framework.options.builder || {},
    },
    renderer: wrapForPnP('@junk-temporary-prototypes/vue3'),
  };
};

export const typescript: PresetProperty<'typescript', StorybookConfig> = async (config) => ({
  ...config,
  skipBabel: true,
});
