import type { StorybookConfig } from '../../frameworks/react-vite/dist';

const config: StorybookConfig = {
  stories: [
    {
      directory: '../manager/src',
      // files: '*.stories.@(ts|tsx|js|jsx|mdx)',
      titlePrefix: 'Manager',
    },
    {
      directory: '../components/src',
      // files: '*.stories.@(js|jsx|ts|tsx|mdx)',
      titlePrefix: 'Components',
    },
    {
      directory: '../blocks/src',
      // files: '*.stories.@(js|jsx|ts|tsx|mdx)',
      titlePrefix: 'Doc Blocks',
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
