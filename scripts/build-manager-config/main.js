module.exports = {
  // Should be kept in sync with addons listed in `baseGenerator.ts`
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  core: {
    builder: '@storybook/builder-webpack5',
    disableTelemetry: true,
  },
  managerWebpack: async (config) => {
    // eslint-disable-next-line no-param-reassign
    config.resolve.fallback = { assert: require.resolve('assert/') };
    return config;
  },
};
