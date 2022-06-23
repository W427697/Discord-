module.exports = {
  // Should be kept in sync with addons listed in `baseGenerator.ts`
  managerEntries: ['/lib/ui/dist/runtime.js'],
  addons: [],
  core: {
    builder: '@storybook/builder-webpack5',
    disableTelemetry: true,
  },
  managerWebpack: async (config, { configDir, mode }) => {
    // eslint-disable-next-line no-param-reassign
    // config.experiments = {
    //   ...config.experiments,
    //   outputModule: true,
    // };
    // eslint-disable-next-line no-param-reassign
    config.output = {
      ...config.output,
      // library: {
      //   export: 'default',
      //   // do not specify a `name` here
      //   type: 'module',
      // },
      // chunkFormat: 'module',
      chunkFilename: 'manager-prebuilt.[name]-[id].js',
      filename: 'manager-prebuilt.bundle.[name].js',
      uniqueName: 'storybook-manager-prebuilt',
    };
    return config;
  },
};
