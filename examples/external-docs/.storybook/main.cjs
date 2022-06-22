const config = {
  stories: [
    {
      directory: '../components',
      titlePrefix: 'Demo',
    },
    {
      directory: '../pages',
      files: 'AccountForm.mdx',
      titlePrefix: 'Docs',
    },
  ],
  logLevel: 'debug',
  addons: ['@storybook/addon-essentials'],
  core: {
    channelOptions: { allowFunction: false, maxDepth: 10 },
  },
  features: {
    postcss: false,
    storyStoreV7: !global.navigator?.userAgent?.match?.('jsdom'),
    buildStoriesJson: true,
    warnOnLegacyHierarchySeparator: false,
    previewMdx2: true,
    disableTelemetry: true,
  },
  framework: '@storybook/react-webpack5',
};
module.exports = config;
