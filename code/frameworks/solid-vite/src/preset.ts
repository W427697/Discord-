import { hasVitePlugins, StorybookConfig } from '@storybook/builder-vite';

export const core: StorybookConfig['core'] = {
  builder: '@storybook/builder-vite',
  renderer: '@storybook/solid',
};

export const viteFinal: StorybookConfig['viteFinal'] = async (config, { presets }) => {
  const { plugins = [] } = config;

  // Add solid plugin if not present
  if (!(await hasVitePlugins(plugins, ['vite-plugin-solid']))) {
    const { default: solidPlugin } = await import('vite-plugin-solid');
    plugins.push(solidPlugin());
  }

  return config;
};
