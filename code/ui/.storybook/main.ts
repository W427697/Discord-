import type { StorybookConfig } from '@storybook/react-vite';
import '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-interactions'],
  core: {
    builder: '@storybook/builder-vite',
  },
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  babel: async (options) => {
    return {
      ...options,
      presets: ['@babel/preset-react'],
      plugins: ['@babel/plugin-syntax-flow'],
    };
  },
};
export default config;