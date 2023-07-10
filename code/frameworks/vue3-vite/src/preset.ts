import { hasVitePlugins } from '@storybook/builder-vite';
import type { PresetProperty } from '@storybook/types';
import { mergeConfig, type PluginOption } from 'vite';
import type { StorybookConfig } from './types';
import { vueComponentMeta } from './plugins/vue-component-meta';

export const core: PresetProperty<'core', StorybookConfig> = {
  builder: '@storybook/builder-vite',
  renderer: '@storybook/vue3',
};

export const viteFinal: StorybookConfig['viteFinal'] = async (
  config: Record<string, any>,
  { _ }: any
) => {
  const plugins: PluginOption[] = [];

  // Add vue plugin if not present
  if (!(await hasVitePlugins(config.plugins ?? [], ['vite:vue']))) {
    const { default: vue } = await import('@vitejs/plugin-vue');
    plugins.push(vue());
  }

  // Add vue-componen-meta plugin
  plugins.push(vueComponentMeta());

  return mergeConfig(config, {
    plugins,
    resolve: {
      alias: {
        vue: 'vue/dist/vue.esm-bundler.js',
      },
    },
  });
};
