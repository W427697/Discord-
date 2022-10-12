import type { StorybookConfig } from '../../frameworks/react-vite/dist';
import vitePluginReact from '@vitejs/plugin-react';
import { mergeConfig } from 'vite';

const config: StorybookConfig = {
  stories: [
    '../../lib/ui/src/**/*.stories.@(ts|tsx|js|jsx|mdx)',
    // '../../lib/components/src/**/*.stories.@(js|jsx|ts|tsx|mdx)',
    // '../../../addons/interactions/**/*.stories.@(ts|tsx|js|jsx|mdx)',
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
  logLevel: 'debug',
};

export default config;
