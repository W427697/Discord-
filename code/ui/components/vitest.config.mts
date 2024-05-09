import { defineConfig, mergeConfig } from 'vitest/config';
import { vitestCommonConfig } from '../../vitest.workspace';
// import { dirname, join } from 'path';
// import { createRequire } from 'module';

// const r = createRequire(import.meta.url);

export default mergeConfig(
  vitestCommonConfig,
  defineConfig({
    test: {
      environment: 'jsdom',

      // alias: {
      //   '@storybook/core/dist/theming': join(
      //     dirname(r.resolve('@storybook/core/package.json')),
      //     '/dist/theming.js'
      //   ),
      //   // '@storybook/theming': r.resolve('@storybook/core/dist/theming'),
      // },
    },
  })
);
