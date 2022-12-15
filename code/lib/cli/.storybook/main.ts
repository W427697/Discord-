import type { StorybookConfig } from '../../../frameworks/react-webpack5/dist';

const config: StorybookConfig = {
  stories: [
    {
      directory: '../src/automigrate',
      titlePrefix: 'Automigrations',
    },
  ],
  addons: ['@storybook/addon-essentials'],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  core: {
    disableTelemetry: true,
  },
  features: {
    interactionsDebugger: true,
  },
  webpackFinal: async (webpackConfig, { configType }) => {
    // eslint-disable-next-line no-param-reassign
    webpackConfig.resolve = {
      ...webpackConfig.resolve,
      fallback: {
        ...webpackConfig.resolve?.fallback,
        os: require.resolve('os-browserify/browser'),
      },
    };

    return webpackConfig;
  },
};

export default config;
