/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig, mergeConfig } from 'vitest/config';
import { sep, posix } from 'path';
import { createVuePlugin } from 'vite-plugin-vue2';
import { vitestCommonConfig } from '../../vitest.workspace';

export default mergeConfig(
  vitestCommonConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      name: __dirname.split(sep).slice(-2).join(posix.sep),
    },
    plugins: [createVuePlugin()],
  })
);
