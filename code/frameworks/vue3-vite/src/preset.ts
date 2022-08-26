import path from 'path';
import fs from 'fs';
import type { StorybookConfig } from '@storybook/builder-vite';

export const addons: StorybookConfig['addons'] = ['@storybook/vue3'];

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

  try {
    // eslint-disable-next-line global-require
    const vuePlugin = require('@vitejs/plugin-vue');
    plugins.push(vuePlugin());
    const { vueDocgen } = await import('./plugins/vue-docgen');
    plugins.push(vueDocgen());
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'MODULE_NOT_FOUND') {
      throw new Error(
        '@storybook/builder-vite requires @vitejs/plugin-vue to be installed ' +
          'when using @storybook/vue or @storybook/vue3.' +
          '  Please install it and start storybook again.'
      );
    }
    throw err;
  }

  const updated = {
    ...config,
    plugins,
    resolve: {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        vue: 'vue/dist/vue.esm-bundler.js',
      },
    },
  };
  return updated;
};
