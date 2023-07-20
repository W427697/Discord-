import { hasVitePlugins } from '@storybook/builder-vite';
import type { PresetProperty } from '@storybook/types';
import { dirname, join } from 'path';
import type { StorybookConfig } from './types';
import { handleSvelteKit } from './utils';
import { svelteDocgen } from './plugins/svelte-docgen';

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
  const { plugins = [] } = config;
  // TODO: set up eslint import to use typescript resolver
  // eslint-disable-next-line import/no-unresolved
  const { svelte, loadSvelteConfig } = await import('@sveltejs/vite-plugin-svelte');
  const svelteConfig = await loadSvelteConfig();

  // Add svelte plugin if the user does not have a Vite config of their own
  if (!(await hasVitePlugins(plugins, ['vite-plugin-svelte']))) {
    plugins.push(svelte());
  }

  // Add docgen plugin
  plugins.push(svelteDocgen(svelteConfig));

  await handleSvelteKit(plugins, options);

  return {
    ...config,
    plugins,
  };
};
