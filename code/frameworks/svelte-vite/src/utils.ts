import type { PluginOption } from 'vite';
import type { Options } from '@storybook/types';

function checkName(plugin: PluginOption, name: string) {
  return typeof plugin === 'object' && 'name' in plugin && plugin.name === name;
}

export function hasPlugin(plugins: PluginOption[], name: string) {
  return Boolean(
    plugins.find((p): boolean => {
      if (Array.isArray(p)) {
        return Boolean(hasPlugin(p, name));
      }
      return checkName(p, name);
    })
  );
}

/**
 * A migration step that ensures the svelte-vite framework still supports SvelteKit,
 * but warns the user that they should use the sveltekit framework instead.
 * Should be removed when we decide to remove support completely for SvelteKit in svelte-vite
 */
export async function handleSvelteKit(plugins: PluginOption[], options: Options) {
  /*
  the sveltekit framework uses this svelte-vite framework under the hood
  so we have to take extra care of only throwing when the user is actually using
  svelte-vite directly and not just through sveltekit
  */
  const frameworkPreset = await options.presets.apply('framework', {}, options);
  const framework = typeof frameworkPreset === 'string' ? frameworkPreset : frameworkPreset.name;

  const hasSvelteKitPlugins =
    hasPlugin(plugins, 'vite-plugin-svelte-kit') ||
    hasPlugin(plugins, 'vite-plugin-sveltekit-build') ||
    hasPlugin(plugins, 'vite-plugin-sveltekit-middleware');

  if (hasSvelteKitPlugins && framework !== '@storybook/sveltekit') {
    throw new Error(
      `
      We've detected a SvelteKit project using the @storybook/svelte-vite framework, which is not supported in Storybook 7.0
      Please use the @storybook/sveltekit framework instead.
      You can migrate automatically by running
      
      npx sb@next automigrate sveltekitFramework

      See https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#sveltekit-needs-the-storybooksveltekit-framework
      `
    );
  }
}
