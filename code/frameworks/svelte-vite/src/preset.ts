import type { StorybookConfig } from '@storybook/builder-vite';
import { PluginOption } from 'vite';
import { svelteDocgen } from './plugins/svelte-docgen';

export const addons: StorybookConfig['addons'] = ['@storybook/svelte'];

export const core: StorybookConfig['core'] = {
  builder: '@storybook/builder-vite',
};

export const viteFinal: StorybookConfig['viteFinal'] = async (config, { presets }) => {
  const { plugins = [] } = config;

  plugins.push(svelteDocgen(config));

  removeSvelteKitPlugin(plugins);

  return {
    ...config,
    plugins,
  };
};

const removeSvelteKitPlugin = (plugins: PluginOption[]) => {
  plugins.forEach((plugin, index) => {
    if (plugin && 'name' in plugin && plugin.name === 'vite-plugin-svelte-kit') {
      // eslint-disable-next-line no-param-reassign -- we explicitly want to mutate the array as stated in Vite docs
      plugins[index] = undefined;
    }
    if (Array.isArray(plugin)) {
      // recursive, Vite plugins can be nested
      removeSvelteKitPlugin(plugin);
    }
  });
};
