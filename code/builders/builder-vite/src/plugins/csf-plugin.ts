import type { Plugin } from 'vite';
import type { Options } from '@storybook/types';
// @ts-expect-error - The tsconfig.json in code sets moduleResolution: Node. But to respect `exports` fields from package.json's, we would need to set the moduleResolution field to either "Node16" or "nodenext", which introduces another wave of errors
import CsfVitePlugin from '@storybook/csf-plugin/vite';

export async function csfPlugin(config: Options): Promise<Plugin> {
  const { presets } = config;

  const addons = await presets.apply('addons', []);
  const docsOptions =
    // @ts-expect-error - not sure what type to use here
    addons.find((a) => [a, a.name].includes('@storybook/addon-docs'))?.options ?? {};

  return CsfVitePlugin(docsOptions?.csfPluginOptions) as Plugin;
}
