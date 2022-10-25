import type { StorybookConfig } from '../../frameworks/react-vite/dist';

const config: StorybookConfig = {
  stories: [
    {
      directory: '../manager/src',
      // these titles uses a special unicode character for the slash as a workaround for https://github.com/storybookjs/storybook/issues/9761
      titlePrefix: '@storybook⁄ui',
    },
    {
      directory: '../components/src',
      titlePrefix: '@storybook⁄components',
    },
    {
      directory: '../blocks/src',
      titlePrefix: '@storybook⁄blocks',
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
