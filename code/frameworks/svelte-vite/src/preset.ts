import type { StorybookConfig } from '@storybook/builder-vite';
import { svelteDocgen } from './plugins/svelte-docgen';

export const addons: StorybookConfig['addons'] = ['@storybook/svelte'];

export const core: StorybookConfig['core'] = {
  builder: '@storybook/builder-vite',
};

export const viteFinal: StorybookConfig['viteFinal'] = async (config, { presets }) => {
  const { plugins = [] } = config;

  plugins.push(svelteDocgen(config));

  return {
    ...config,
    plugins,
  };
};
