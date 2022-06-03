const { VanillaExtractPlugin } = require('@vanilla-extract/webpack-plugin');

module.exports = {
  stories: ['../src/**/*.stories.*'],
  addons: ['@storybook/addon-essentials'],
  framework: '@storybook/react',
  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.
    config.plugins.push(new VanillaExtractPlugin());

    // Return the altered config
    return config;
  },
};
