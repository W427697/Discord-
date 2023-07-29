import { dirname, join } from 'path';
import type { PresetProperty } from '@storybook/types';
import { mergeConfig } from 'vite';
import type { StorybookConfig } from './types';
import { vueComponentMeta } from './plugins/vue-component-meta';

const getAbsolutePath = <I extends string>(input: I): I =>
  dirname(require.resolve(join(input, 'package.json'))) as any;

export const core: PresetProperty<'core', StorybookConfig> = async (config, options) => {
  const framework = await options.presets.apply<StorybookConfig['framework']>('framework');

  return {
    ...config,
    builder: {
      name: getAbsolutePath('@storybook/builder-vite'),
      options: typeof framework === 'string' ? {} : framework?.options.builder || {},
    },
    renderer: getAbsolutePath('@storybook/vue'),
  };
};

export const typescript: PresetProperty<'typescript', StorybookConfig> = async (config) => ({
  ...config,
  skipBabel: true,
});

export const viteFinal: StorybookConfig['viteFinal'] = async (config, { presets }) => {
  return mergeConfig(config, {
    plugins: [vueComponentMeta()],
    resolve: {
      alias: {
        vue: 'vue/dist/vue.esm.js',
      },
    },
  });
};
