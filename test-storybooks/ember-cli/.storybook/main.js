const path = require('path');

const namedBlockPolyfill = require('ember-named-blocks-polyfill/lib/named-blocks-polyfill-plugin');

module.exports = {
  emberOptions: {
    polyfills: [namedBlockPolyfill],
  },
  stories: ['../stories/*.stories.js'],
  logLevel: 'debug',
  addons: [
    '@junk-temporary-prototypes/addon-a11y',
    '@junk-temporary-prototypes/addon-storysource',
    '@junk-temporary-prototypes/addon-actions',
    '@junk-temporary-prototypes/addon-docs',
    '@junk-temporary-prototypes/addon-controls',
    '@junk-temporary-prototypes/addon-links',
    '@junk-temporary-prototypes/addon-viewport',
    '@junk-temporary-prototypes/addon-backgrounds',
    '@junk-temporary-prototypes/addon-highlight',
  ],
  webpackFinal: async (config) => {
    config.module.rules.push({
      test: [/\.stories\.js$/, /index\.js$/],
      use: require.resolve('@junk-temporary-prototypes/source-loader'),
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
    channelOptions: { allowFunction: false, maxDepth: 10 },
    disableTelemetry: true,
  },
  staticDirs: ['../ember-output'],
  features: {
    buildStoriesJson: false,
    storyStoreV7: false,
  },
  framework: { name: '@junk-temporary-prototypes/ember' },
};
