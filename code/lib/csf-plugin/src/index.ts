import { createUnplugin } from 'unplugin';
import type { EnrichCsfOptions } from '@storybook/csf-tools';
import { rollupBasedPlugin } from './rollup-based-plugin';

export type CsfPluginOptions = EnrichCsfOptions;

export const unplugin = createUnplugin<CsfPluginOptions>((options) => {
  return {
    name: 'unplugin-csf',
    rollup: {
      ...rollupBasedPlugin(options),
    },
    vite: {
      enforce: 'pre',
      ...rollupBasedPlugin(options),
    },
    webpack(compiler) {
      compiler.options.module.rules.unshift({
        enforce: 'pre',
        use: {
          options,
          loader: require.resolve('./webpack-loader'),
        },
      });
    },
    rspack(compiler) {
      compiler.options.module.rules.unshift({
        enforce: 'pre',
        use: {
          options,
          loader: require.resolve('./webpack-loader'),
        },
      });
    },
  };
});

export const { esbuild } = unplugin;
export const { webpack } = unplugin;
export const { rollup } = unplugin;
export const { vite } = unplugin;
