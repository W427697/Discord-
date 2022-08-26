import path from 'path';
import fs from 'fs';
import type { StorybookConfig } from '@storybook/builder-vite';

export const addons: StorybookConfig['addons'] = ['@storybook/svelte'];

export const core: StorybookConfig['core'] = {
  builder: '@storybook/builder-vite',
};

export function readPackageJson(): Record<string, any> | false {
  const packageJsonPath = path.resolve('package.json');
  if (!fs.existsSync(packageJsonPath)) {
    return false;
  }

  const jsonContent = fs.readFileSync(packageJsonPath, 'utf8');
  return JSON.parse(jsonContent);
}

export const viteFinal: StorybookConfig['viteFinal'] = async (config, { presets }) => {
  const { plugins = [] } = config;
  const svelteOptions = await presets.apply<Record<string, any>>('frameworkOptions');
  try {
    // eslint-disable-next-line global-require
    const sveltePlugin = require('@sveltejs/vite-plugin-svelte').svelte;

    // We need to create two separate svelte plugins, one for stories, and one for other svelte files
    // because stories.svelte files cannot be hot-module-reloaded.
    // Suggested in: https://github.com/sveltejs/vite-plugin-svelte/issues/321#issuecomment-1113205509

    // First, create an array containing user exclude patterns, to combine with ours.

    let userExclude = [];
    if (Array.isArray(svelteOptions?.exclude)) {
      userExclude = svelteOptions?.exclude;
    } else if (svelteOptions?.exclude) {
      userExclude = [svelteOptions?.exclude];
    }

    // These are the svelte stories we need to exclude from HMR
    const storyPatterns = ['**/*.story.svelte', '**/*.stories.svelte'];
    // Non-story svelte files
    // Starting in 1.0.0-next.42, svelte.config.js is included by default.
    // We disable that, but allow it to be overridden in svelteOptions
    plugins.push(sveltePlugin({ ...svelteOptions, exclude: [...userExclude, ...storyPatterns] }));
    // Svelte stories without HMR
    const storySveltePlugin = sveltePlugin({
      ...svelteOptions,
      exclude: userExclude,
      include: storyPatterns,
      hot: false,
    });
    plugins.push({
      // Starting in 1.0.0-next.43, the plugin function returns an array of plugins.  We only want the first one here.
      ...(Array.isArray(storySveltePlugin) ? storySveltePlugin[0] : storySveltePlugin),
      name: 'vite-plugin-svelte-stories',
    });
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'MODULE_NOT_FOUND') {
      throw new Error(
        '@storybook/builder-vite requires @sveltejs/vite-plugin-svelte to be installed' +
          ' when using @storybook/svelte.' +
          '  Please install it and start storybook again.'
      );
    }
    throw err;
  }

  // eslint-disable-next-line global-require
  const { loadSvelteConfig } = require('@sveltejs/vite-plugin-svelte');
  const csfConfig = { ...loadSvelteConfig(), ...svelteOptions };

  try {
    // eslint-disable-next-line global-require
    const csfPlugin = require('./plugins/csf-plugin').default;
    plugins.push(csfPlugin(csfConfig));
  } catch (err) {
    // Not all projects use `.stories.svelte` for stories, and by default 6.5+ does not auto-install @storybook/addon-svelte-csf.
    // If it's any other kind of error, re-throw.
    if ((err as NodeJS.ErrnoException).code !== 'MODULE_NOT_FOUND') {
      throw err;
    }
  }

  const { svelteDocgen } = await import('./plugins/svelte-docgen');
  plugins.push(svelteDocgen(config));

  return {
    ...config,
    plugins,
  };
};
