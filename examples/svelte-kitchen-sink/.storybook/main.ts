import type { StorybookConfig } from '@storybook/svelte-webpack5/types';

const sveltePreprocess = require('svelte-preprocess');

const path = require('path');

const mainConfig: StorybookConfig = {
  stories: ['../src/stories/**/*.stories.@(ts|tsx|js|jsx||mdx|svelte)'],
  logLevel: 'debug',
  addons: [
    '@storybook/addon-storysource',
    '@storybook/addon-actions',
    {
      name: '@storybook/addon-docs',
      options: {
        configureJSX: true,
      },
    },
    '@storybook/addon-controls',
    '@storybook/addon-interactions',
    '@storybook/addon-links',
    '@storybook/addon-backgrounds',
    '@storybook/addon-viewport',
    '@storybook/addon-a11y',
  ],
  webpackFinal: async (config) => {
    config.module.rules.push({
      test: [/\.stories\.js$/, /index\.js$/],
      use: [require.resolve('@storybook/source-loader')],
      include: [path.resolve(__dirname, '../src')],
      enforce: 'pre',
    });
    return config;
  },
  core: {
    channelOptions: { allowFunction: false, maxDepth: 10 },
    disableTelemetry: true,
  },
  staticDirs: ['../public'],
  features: {
    breakingChangesV7: true,
  },
  framework: {
    name: '@storybook/svelte-webpack5',
    options: {
      preprocess: sveltePreprocess(),
    },
  },
};

module.exports = mainConfig;
