module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  core: {
    builder: '@storybook/builder-webpack5',
    disableTelemetry: true,
  },
  features: {
    buildStoriesJson: false,
    breakingChangesV7: false,
    storyStoreV7: false,
    channelOptions: { allowFunction: false, maxDepth: 10 },
  },
  framework: '@storybook/vue3-webpack5',
};
