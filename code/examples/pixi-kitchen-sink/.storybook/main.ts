import type { StorybookConfig } from '@storybook/pixi-webpack5';

const mainConfig: StorybookConfig = {
  // this dirname is because we run tests from project root
  stories: ['../stories/**/*.stories.@(ts|tsx|js|jsx|mdx)'],
  staticDirs: ['../public'],
  logLevel: 'debug',
  addons: [
    '@storybook/addon-actions',
    '@storybook/addon-backgrounds',
    '@storybook/addon-controls',
    '@storybook/addon-storysource',
    '@storybook/addon-viewport',
    '@storybook/addon-links',
    '@storybook/addon-highlight',
  ],
  core: {
    channelOptions: { allowFunction: false, maxDepth: 10 },
    disableTelemetry: true,
  },
  features: {
    buildStoriesJson: true,
    breakingChangesV7: true,
  },
  framework: '@storybook/pixi-webpack5',
};

module.exports = mainConfig;
