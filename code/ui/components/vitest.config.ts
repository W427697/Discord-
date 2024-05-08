import { defineConfig, mergeConfig } from 'vitest/config';
import { vitestCommonConfig } from '../../vitest.workspace';

export default mergeConfig(
  vitestCommonConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      alias: {
        '@storybook/core/dist/theming': '@storybook/core/dist/theming.js',
      },
    },
  })
);
