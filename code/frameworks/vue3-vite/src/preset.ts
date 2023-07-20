import { hasVitePlugins } from '@storybook/builder-vite';
import type { PresetProperty } from '@storybook/types';
import { mergeConfig, type PluginOption } from 'vite';
import { dirname, join } from 'path';
import type { StorybookConfig } from './types';
import { vueDocgen } from './plugins/vue-docgen';

const wrapForPnP = (input: string) => dirname(require.resolve(join(input, 'package.json')));

export const core: PresetProperty<'core', StorybookConfig> = async (config, options) => {
  const framework = await options.presets.apply<StorybookConfig['framework']>('framework');

  return {
    ...config,
    builder: {
      name: wrapForPnP('@storybook/builder-vite') as '@storybook/builder-vite',
      options: typeof framework === 'string' ? {} : framework?.options?.builder || {},
    },
    renderer: wrapForPnP('@storybook/vue3'),
  };
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
