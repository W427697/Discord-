import type { StorybookConfig } from '@storybook/react-webpack5/types';

const config: StorybookConfig = {
  stories: [
    {
      directory: '../components',
      titlePrefix: 'Demo',
    },
  ],
  logLevel: 'debug',
  addons: ['@storybook/addon-essentials'],
  typescript: {
    check: true,
    checkOptions: {},
    reactDocgenTypescriptOptions: {
      propFilter: (prop) => ['label', 'disabled'].includes(prop.name),
    },
  },
  core: {
    channelOptions: { allowFunction: false, maxDepth: 10 },
  },
  features: {
    postcss: false,
    storyStoreV7: !global.navigator?.userAgent?.match?.('jsdom'),
    buildStoriesJson: true,
    babelModeV7: true,
    previewMdx2: true,
  },
  framework: '@storybook/react-webpack5',
};
module.exports = config;
