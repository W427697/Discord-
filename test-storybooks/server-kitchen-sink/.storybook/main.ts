import type { StorybookConfig } from '@junk-temporary-prototypes/server-webpack5';

const mainConfig: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(json|yaml|yml)'],
  logLevel: 'debug',
  addons: [
    '@junk-temporary-prototypes/addon-docs',
    '@junk-temporary-prototypes/addon-a11y',
    '@junk-temporary-prototypes/addon-actions',
    '@junk-temporary-prototypes/addon-backgrounds',
    '@junk-temporary-prototypes/addon-links',
    '@junk-temporary-prototypes/addon-controls',
    '@junk-temporary-prototypes/addon-highlight',
  ],
  core: {
    disableTelemetry: true,
  },
  features: {
    storyStoreV7: false,
  },
  framework: '@junk-temporary-prototypes/server-webpack5',
};

module.exports = mainConfig;
