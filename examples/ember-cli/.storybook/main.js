const path = require('path');

const namedBlockPolyfill = require('ember-named-blocks-polyfill/lib/named-blocks-polyfill-plugin');

module.exports = {
  emberOptions: {
    polyfills: [namedBlockPolyfill],
  },
  stories: ['../stories/*.stories.js'],
  logLevel: 'debug',
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-storysource',
    '@storybook/addon-actions',
    '@storybook/addon-docs',
    '@storybook/addon-controls',
    '@storybook/addon-links',
    '@storybook/addon-viewport',
    '@storybook/addon-backgrounds',
  ],
  webpackFinal: async (config) => {
    config.module.rules.push({
      test: [/\.stories\.js$/, /index\.js$/],
      use: require.resolve('@storybook/source-loader'),
      include: [path.resolve(__dirname, '../')],
      enforce: 'pre',
    });
    // eslint-disable-next-line no-param-reassign
    config.resolve.fallback = {
      fs: false,
      child_process: false,
      zlib: require.resolve('browserify-zlib'),
      vm: require.resolve('vm-browserify'),
      stream: require.resolve('stream-browserify'),
      os: require.resolve('os-browserify/browser'),
      ...config.resolve.fallback,
    };
    return config;
  },
  core: {
    builder: '@storybook/builder-webpack5',
    disableTelemetry: true,
  },
  staticDirs: ['../ember-output'],
  features: {
    buildStoriesJson: true,
    breakingChangesV7: true,
  },
  framework: '@storybook/ember',
};
