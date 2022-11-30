import path from 'path';
import fs from 'fs';
import type { PluginOption } from 'vite';
import { deprecate } from '@storybook/node-logger';
import { withoutVitePlugins } from '@storybook/builder-vite';

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
 * but warns the user that they should use the svelte-kit framework instead.
 * Should be removed when we decide to remove support completely for SvelteKit in svelte-vite
 */
export function handleSvelteKit(plugins: PluginOption[]): PluginOption[] {
  if (!hasPlugin(plugins, 'vite-plugin-svelte-kit')) {
    // this is not a SvelteKit project ✅
    return plugins;
  }

  /*
  the svelte-kit framework uses this svelte-vite framework under the hood
  so we have to take extra care of only warning when the user is actually using
  svelte-vite directly and not just through svelte-kit
  */

  const packageJsonPath = path.resolve('package.json');
  if (!fs.existsSync(packageJsonPath)) {
    // we can't determine if this is using svelte-kit, let's assume it does ✅
    return plugins;
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const allDependencies = [
    ...Object.keys(packageJson.dependencies || {}),
    ...Object.keys(packageJson.devDependencies || {}),
  ];
  if (
    allDependencies.includes('@storybook/svelte-kit') &&
    !allDependencies.includes('@storybook/svelte-vite')
  ) {
    // this uses @storybook/svelte-kit, so everything is fine ✅
    return plugins;
  }

  // this is a SvelteKit project but uses @storybook/svelte-vite, warn user about this and remove vite-plugin-svelte-kit ❌
  deprecate(
    'SvelteKit support in @storybook/svelte-vite is deprecated in Storybook 7.0, use @storybook/svelte-kit instead.'
  );
  return withoutVitePlugins(plugins, ['vite-plugin-svelte-kit']);
}
