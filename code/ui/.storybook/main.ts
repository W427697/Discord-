// import vitePluginReact from '@vitejs/plugin-react';
import type { PluginOption } from 'vite';
import type { StorybookConfig } from '../../frameworks/react-vite/dist';

const config: StorybookConfig = {
  stories: [
    {
      directory: '../manager/src/**/',
      files: '*.stories.@(ts|tsx|js|jsx|mdx)',
      titlePrefix: 'Manager',
    },
    {
      directory: '../components/src/**/',
      files: '*.stories.@(js|jsx|ts|tsx|mdx)',
      titlePrefix: 'Components',
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
};

export default config;
