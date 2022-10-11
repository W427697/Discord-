/* eslint-disable global-require */
import type { StorybookConfig, TypescriptOptions } from '@storybook/builder-vite';
import { hasPlugin, readPackageJson } from './utils';

export const addons: StorybookConfig['addons'] = ['@storybook/preact'];

export const core: StorybookConfig['core'] = {
  builder: '@storybook/builder-vite',
};

export const viteFinal: StorybookConfig['viteFinal'] = async (config, { presets }) => {
  const { plugins = [] } = config;

  // Add preact plugin if not present
  if (!hasPlugin(plugins, 'vite:preact-jsx')) {
    const { default: preact } = await import('@preact/preset-vite');
    plugins.push(preact());
  }

  // Add docgen plugin
  const { reactDocgen, reactDocgenTypescriptOptions } = await presets.apply<any>(
    'typescript',
    {} as TypescriptOptions
  );
  let typescriptPresent;
  try {
    const pkgJson = readPackageJson();
    typescriptPresent =
      pkgJson && (pkgJson.devDependencies?.typescript || pkgJson.dependencies?.typescript);
  } catch (e) {
    typescriptPresent = false;
  }
  if (reactDocgen === 'react-docgen-typescript' && typescriptPresent) {
    plugins.push(
      require('@joshwooding/vite-plugin-react-docgen-typescript')(reactDocgenTypescriptOptions)
    );
  } else if (reactDocgen) {
    const { reactDocgen: docgenPlugin } = await import('./plugins/react-docgen');
    // Needs to run before the react plugin, so add to the front
    plugins.unshift(docgenPlugin());
  }

  return config;
};
