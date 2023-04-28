import { dirname, join } from 'path';
import { PresetProperty } from '@junk-temporary-prototypes/types';
import { StorybookConfig } from './types';

const wrapForPnP = (input: string) => dirname(require.resolve(join(input, 'package.json')));

export const addons: PresetProperty<'addons', StorybookConfig> = [
  require.resolve('./server/framework-preset-angular-cli'),
  require.resolve('./server/framework-preset-angular-ivy'),
  require.resolve('./server/framework-preset-angular-docs'),
];

export const previewAnnotations: StorybookConfig['previewAnnotations'] = (entries = []) => [
  ...entries,
  require.resolve('./client/config'),
];

export const core: PresetProperty<'core', StorybookConfig> = async (config, options) => {
  const framework = await options.presets.apply<StorybookConfig['framework']>('framework');

  return {
    ...config,
    builder: {
      name: wrapForPnP('@junk-temporary-prototypes/builder-webpack5') as '@junk-temporary-prototypes/builder-webpack5',
      options: typeof framework === 'string' ? {} : framework.options.builder || {},
    },
  };
};

export const typescript: PresetProperty<'typescript', StorybookConfig> = async (config) => {
  return {
    ...config,
    skipBabel: true,
  };
};
