import type { StorybookConfig } from '@storybook/builder-vite';
import { hasVitePlugins } from '@storybook/builder-vite';
import solid from 'vite-plugin-solid';

export const core: StorybookConfig['core'] = {
  builder: '@storybook/builder-vite',
  renderer: '@storybook/html',
};

export const viteFinal: StorybookConfig['viteFinal'] = async (config) => {
  const { plugins = [] } = config;

  // Add Solid plugin if not present
  if (!(await hasVitePlugins(plugins, ['vite:solid']))) {
    plugins.push(solid());
  }

  // TODO: Add docgen plugin per issue https://github.com/storybookjs/storybook/issues/19739

  return config;
};
