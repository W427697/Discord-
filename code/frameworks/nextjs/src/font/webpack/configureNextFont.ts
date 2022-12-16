import type { Configuration } from 'webpack';
import VirtualLocalFontModulePlugin from './plugin/virtual-local-font-module';

export function configureNextFont(baseConfig: Configuration) {
  baseConfig.plugins = [...(baseConfig.plugins || []), new VirtualLocalFontModulePlugin()];
  baseConfig.resolveLoader = {
    ...baseConfig.resolveLoader,
    alias: {
      ...baseConfig.resolveLoader?.alias,
      'storybook-nextjs-font-loader': require.resolve(
        './font/webpack/loader/storybook-nextjs-font-loader'
      ),
    },
  };
}
