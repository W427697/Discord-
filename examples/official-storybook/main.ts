/// <reference types="node" />
import type { StorybookConfig } from '@storybook/react-webpack5/types';

const config: StorybookConfig = {
  stories: [
    {
      directory: './stories/title',
      titlePrefix: 'Custom Prefix',
    },
    // FIXME: Breaks e2e tests './intro.stories.mdx',
    '../../lib/ui/src/**/*.stories.@(js|tsx|mdx)',
    '../../lib/components/src/**/*.stories.@(js|tsx|mdx)',
    './stories/**/*.stories.@(js|ts|tsx|mdx)',
    './../../addons/docs/**/*.stories.tsx',
    './../../addons/interactions/**/*.stories.(tsx|mdx)',
  ],
  addons: [
    {
      name: '@storybook/addon-docs',
      options: {
        transcludeMarkdown: true,
        // needed if you use addon-docs in conjunction
        // with addon-storysource
        sourceLoaderOptions: null,
      },
    },
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-storysource',
    '@storybook/addon-links',
    '@storybook/addon-jest',
    '@storybook/addon-a11y',
  ],
  core: {
    builder: '@storybook/builder-webpack5',
    channelOptions: { allowFunction: false, maxDepth: 10 },
    disableTelemetry: true,
  },
  logLevel: 'debug',
  features: {
    modernInlineRender: true,
    interactionsDebugger: true,
    storyStoreV7: false,
  },
  staticDirs: [
    './statics/public',
    {
      from: './statics/examples/example1',
      to: '/example1',
    },
    {
      from: './statics/examples/example2',
      to: '/example2',
    },
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {
      fastRefresh: true,
      strictMode: true,
    },
  },
};
module.exports = config;
