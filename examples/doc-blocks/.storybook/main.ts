import type { StorybookConfig } from '@storybook/react/types';

const { VanillaExtractPlugin } = require('@vanilla-extract/webpack-plugin');

const config: StorybookConfig = {
  stories: [
    {
      directory: '../../../lib/blocks/src',
    },
  ],
  logLevel: 'debug',
  addons: ['@storybook/addon-essentials'],
  core: {
    builder: { name: 'webpack4' },
    channelOptions: { allowFunction: false, maxDepth: 10 },
    disableTelemetry: true,
  },
  features: {
    postcss: false,
    storyStoreV7: true,
    buildStoriesJson: true,
    babelModeV7: false,
    warnOnLegacyHierarchySeparator: false,
    previewMdx2: true,
    breakingChangesV7: true,
  },
  framework: '@storybook/react',
  webpackFinal: async (conf, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.
    conf.plugins?.push(new VanillaExtractPlugin());

    // Return the altered config
    return conf;
  },
};
module.exports = config;
