import type { PresetProperty } from '@storybook/types';
import type { PluginOption } from 'vite';
import { dirname, join } from 'path';
import type { StorybookConfig } from './types';
import { vueComponentMeta } from './plugins/vue-component-meta';

const getAbsolutePath = <I extends string>(input: I): I =>
  dirname(require.resolve(join(input, 'package.json'))) as any;

export const core: PresetProperty<'core'> = {
  builder: getAbsolutePath('@storybook/builder-vite'),
  renderer: getAbsolutePath('@storybook/vue3'),
};

export const viteFinal: StorybookConfig['viteFinal'] = async (
  config: Record<string, any>,
  { _ }: any
) => {
  const plugins: PluginOption[] = [];

  // Add docgen plugin
  plugins.push(vueComponentMeta());

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
