import type { StorybookConfig } from '@storybook/builder-vite';
import { hasPlugin } from './utils';
import { svelteDocgen } from './plugins/svelte-docgen';

export const addons: StorybookConfig['addons'] = ['@storybook/svelte'];

export const core: StorybookConfig['core'] = {
  builder: '@storybook/builder-vite',
};

export const viteFinal: StorybookConfig['viteFinal'] = async (config, { presets }) => {
  const { plugins = [] } = config;

  // Add svelte plugin if not present
  if (!hasPlugin(plugins, 'vite-plugin-svelte')) {
    const { svelte } = await import('@sveltejs/vite-plugin-svelte');
    plugins.push(svelte());
  }

  // Add docgen plugin
  plugins.push(svelteDocgen(config));

  return {
    ...config,
    plugins,
  };
};
