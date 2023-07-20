// @ts-expect-error -- TS picks up the type from preset.js instead of dist/preset.d.ts
import { viteFinal as svelteViteFinal } from '@storybook/svelte-vite/preset';
import type { PresetProperty } from '@storybook/types';
import { withoutVitePlugins } from '@storybook/builder-vite';
import { dirname, join } from 'path';
import { configOverrides } from './plugins/config-overrides';
import { type StorybookConfig } from './types';

const wrapForPnP = (input: string) => dirname(require.resolve(join(input, 'package.json')));

export const core: PresetProperty<'core', StorybookConfig> = async (config, options) => {
  const framework = await options.presets.apply<StorybookConfig['framework']>('framework');

  return {
    ...config,
    builder: {
      name: wrapForPnP('@storybook/builder-vite') as '@storybook/builder-vite',
      options: typeof framework === 'string' ? {} : framework?.options?.builder || {},
    },
    renderer: wrapForPnP('@storybook/svelte'),
  };
};

export const viteFinal: NonNullable<StorybookConfig['viteFinal']> = async (config, options) => {
  const baseConfig = await svelteViteFinal(config, options);

  let { plugins = [] } = baseConfig;

  // disable specific plugins that are not compatible with Storybook
  plugins = (
    await withoutVitePlugins(plugins, [
      'vite-plugin-sveltekit-compile',
      'vite-plugin-sveltekit-guard',
    ])
  ).concat(configOverrides());

  return { ...baseConfig, plugins };
};
