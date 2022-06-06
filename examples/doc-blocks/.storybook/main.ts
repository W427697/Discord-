import type { StorybookConfig } from '@storybook/react/types';

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
};
module.exports = config;
