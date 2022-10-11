import type { StorybookConfig } from '../frameworks/react-vite/dist';

const config: StorybookConfig = {
  stories: [
    '../lib/ui/src/components/notifications/NotificationItem.stories.jsx',
    // '../lib/ui/src/**/*.stories.@(ts|tsx|js|jsx|mdx)',
    // '../lib/components/src/**/*.stories.@(js|jsx|ts|tsx|mdx)',
    // './../../addons/interactions/**/*.stories.@(ts|tsx|js|jsx|mdx)',
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
