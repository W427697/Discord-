import { hasVitePlugins } from '@junk-temporary-prototypes/builder-vite';
import type { PresetProperty } from '@junk-temporary-prototypes/types';
import preact from '@preact/preset-vite';
import type { StorybookConfig } from './types';

export const core: PresetProperty<'core', StorybookConfig> = {
  builder: '@junk-temporary-prototypes/builder-vite',
  renderer: '@junk-temporary-prototypes/preact',
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
