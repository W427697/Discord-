import { TestPlugin } from "./plugin";

const path = require('path');

module.exports = {
  stories: ['../src/stories/**/*.stories.@(ts|mdx)'],
  logLevel: 'debug',
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-controls',
    '@storybook/addon-storysource',
    '@storybook/addon-actions',
    '@storybook/addon-viewport',
    '@storybook/addon-interactions',
    '@storybook/addon-links',
    '@storybook/addon-jest',
    '@storybook/addon-backgrounds',
    '@storybook/addon-a11y',
    '@storybook/addon-toolbars',
  ],
  core: {
    builder: 'webpack4',
  },
  angularOptions: {
    enableIvy: true,
  },
  // These are just here to test composition. They could be added to any storybook example project
  refs: {
    react: {
      title: 'ReactTS',
      url: 'http://localhost:9011',
    },
    first: {
      title: 'Composition test one',
      url: 'https://storybookjs.netlify.app/cra-ts-essentials',
    },
    second: {
      title: 'Composition test two',
      url: 'https://storybookjs.netlify.app/cra-ts-essentials',
    },
    third: {
      title: 'Composition test three',
      url: 'https://storybookjs.netlify.app/cra-ts-essentials',
    },
  },
  staticDirs: ['../src/assets'],
  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    // Make whatever fine-grained changes you need
    config.module.rules.push({
      test: /\.stories.ts$/,
      use: [
        {
          loader: path.resolve(__dirname, './loader.ts'),
          //   options: {},
        },
      ],
    });

    config.plugins.push(new TestPlugin());

    // Return the altered config
    return config;
  },
};
