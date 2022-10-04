import type { StorybookConfig } from '@storybook/builder-vite';
import { svelteDocgen } from './plugins/svelte-docgen';

export const addons: StorybookConfig['addons'] = ['@storybook/svelte'];

export const core: StorybookConfig['core'] = {
  builder: '@storybook/builder-vite',
};

export const viteFinal: StorybookConfig['viteFinal'] = async (config, options) => {
  const { plugins = [] } = config;
  const svelteOptions: Record<string, any> = await options.presets.apply(
    'svelteOptions',
    {},
    options
  );

  const { loadSvelteConfig } = await import('@sveltejs/vite-plugin-svelte');
  const svelteConfig = { ...(await loadSvelteConfig()), ...svelteOptions };
  plugins.push(svelteDocgen(svelteConfig));

  return {
    ...config,
    plugins,
  };
};
