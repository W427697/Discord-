import type { StorybookConfig } from '../../frameworks/react-vite/dist';

const config: StorybookConfig = {
  stories: [
    {
      directory: '../manager/src',
      titlePrefix: '@storybook-ui',
    },
    {
      directory: '../components/src',
      titlePrefix: '@storybook-components',
    },
    {
      directory: '../blocks/src',
      titlePrefix: '@storybook-blocks',
    },
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  core: {
    disableTelemetry: true,
  },
};

export default config;
