const path = require('path');

module.exports = {
  stories: ['../src/stories/**/*.stories.@(js|mdx)'],
  logLevel: 'debug',
  addons: [
    '@storybook/preset-create-react-app',
    '@storybook/addon-ie11',
    {
      name: '@storybook/addon-docs/preset',
      options: {
        configureJSX: true,
      },
    },
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-backgrounds',
    '@storybook/addon-a11y',
    '@storybook/addon-jest',
  ],
  webpackFinal: (config) => {
    // add monorepo root as a valid directory to import modules from
    config.resolve.plugins.forEach((p) => {
      if (Array.isArray(p.appSrcs)) {
        p.appSrcs.push(path.join(__dirname, '..', '..', '..'));
      }
    });
    return config;
  },
  core: {
    builder: 'webpack4',
    disableTelemetry: true,
  },
  staticDirs: ['../public'],
  features: {
    buildStoriesJson: true,
    breakingChangesV7: true,
  },
  framework: {
    name: '@storybook/react-webpack4',
    options: { fastRefresh: true },
  },
};
