import { hasVitePlugins } from '@storybook/builder-vite';
import type { PresetProperty } from '@storybook/types';
import preact from '@preact/preset-vite';
import { dirname, join } from 'path';
import type { StorybookConfig } from './types';

const wrapForPnP = (input: string) => dirname(require.resolve(join(input, 'package.json')));

export const core: PresetProperty<'core', StorybookConfig> = async (config, options) => {
  const framework = await options.presets.apply<StorybookConfig['framework']>('framework');

  return {
    ...config,
    builder: {
      name: wrapForPnP('@storybook/builder-vite') as '@storybook/builder-vite',
      options: typeof framework === 'string' ? {} : framework?.options?.builder || {},
    },
    renderer: wrapForPnP('@storybook/preact'),
  };
};

export const viteFinal: StorybookConfig['viteFinal'] = async (config) => {
  const { plugins = [] } = config;

  // Add Preact plugin if not present
  if (!(await hasVitePlugins(plugins, ['vite:preact-jsx']))) {
    plugins.push(preact());
  }

  // TODO: Add docgen plugin per issue https://github.com/storybookjs/storybook/issues/19739

  return config;
};
