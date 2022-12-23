import type { StorybookConfig } from '@storybook/builder-vite';
// import { hasVitePlugins } from '@storybook/builder-vite';
import preact from '@preact/preset-vite';

export const core: StorybookConfig['core'] = {
  builder: '@storybook/builder-vite',
  renderer: '@storybook/preact',
};

export const viteFinal: StorybookConfig['viteFinal'] = async (config, { presets }) => {
  const { plugins = [] } = config;

  // Add preact plugin if not present
  // FIXME: check vite plugins for presence of preact plugin
  plugins.push(preact({ prefreshEnabled: true }));

  // TODO: Add docgen plugin per issue https://github.com/storybookjs/storybook/issues/19739

  return config;
};
