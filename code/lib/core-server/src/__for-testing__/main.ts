/// <reference types="node" />
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import type { StorybookConfig } from '@junk-temporary-prototypes/react-webpack5';

const config: StorybookConfig = {
  stories: [
    '../../ui/manager/src/**/*.stories.@(ts|tsx|js|jsx|mdx)',
    '../../ui/components/src/**/*.stories.@(ts|tsx|js|jsx|mdx)',
    './../../addons/docs/**/*.stories.@(ts|tsx|js|jsx|mdx)',
    './../../addons/interactions/**/*.stories.@(ts|tsx|js|jsx|mdx)',
  ],
  addons: [
    {
      name: '@junk-temporary-prototypes/addon-docs',
      options: {
        sourceLoaderOptions: null,
      },
    },
    '@junk-temporary-prototypes/addon-essentials',
    '@junk-temporary-prototypes/addon-interactions',
    '@junk-temporary-prototypes/addon-storysource',
    '@junk-temporary-prototypes/addon-links',
    '@junk-temporary-prototypes/addon-jest',
    '@junk-temporary-prototypes/addon-a11y',
  ],
  core: {
    channelOptions: { allowFunction: false, maxDepth: 10 },
    disableTelemetry: true,
  },
  logLevel: 'debug',
  features: {
    storyStoreV7: false,
  },
  framework: {
    name: '@junk-temporary-prototypes/react-webpack5',
    options: {
      fastRefresh: true,
      strictMode: true,
    },
  },
};
module.exports = config;
