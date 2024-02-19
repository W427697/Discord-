import type { PresetProperty } from '@storybook/types';
import { dirname, join } from 'path';
import type { PluginOption } from 'vite';
import { vueComponentMeta } from './plugins/vue-component-meta';
import type { StorybookConfig } from './types';

const getAbsolutePath = <I extends string>(input: I): I =>
  dirname(require.resolve(join(input, 'package.json'))) as any;

export const core: PresetProperty<'core'> = {
  builder: getAbsolutePath('@storybook/builder-vite'),
  renderer: getAbsolutePath('@storybook/vue3'),
};

export const viteFinal: StorybookConfig['viteFinal'] = async (config) => {
  const plugins: PluginOption[] = [];

  // Add vue-component-meta plugin
  plugins.push(await vueComponentMeta());

  const { mergeConfig } = await import('vite');
  return mergeConfig(config, {
    plugins,
    resolve: {
      alias: {
        vue: 'vue/dist/vue.esm-bundler.js',
      },
    },
  });
};
