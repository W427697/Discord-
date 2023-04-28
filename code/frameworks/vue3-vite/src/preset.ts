import { hasVitePlugins } from '@junk-temporary-prototypes/builder-vite';
import type { PresetProperty } from '@junk-temporary-prototypes/types';
import { mergeConfig, type PluginOption } from 'vite';
import type { StorybookConfig } from './types';
import { vueDocgen } from './plugins/vue-docgen';

export const core: PresetProperty<'core', StorybookConfig> = {
  builder: '@junk-temporary-prototypes/builder-vite',
  renderer: '@junk-temporary-prototypes/vue3',
};

export const viteFinal: StorybookConfig['viteFinal'] = async (config, { presets }) => {
  const plugins: PluginOption[] = [];

  // Add vue plugin if not present
  if (!(await hasVitePlugins(config.plugins, ['vite:vue']))) {
    const { default: vue } = await import('@vitejs/plugin-vue');
    plugins.push(vue());
  }

  // Add docgen plugin
  plugins.push(vueDocgen());

  return mergeConfig(config, {
    plugins,
    resolve: {
      alias: {
        vue: 'vue/dist/vue.esm-bundler.js',
      },
    },
  });
};
