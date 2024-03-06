import { defineConfig, mergeConfig } from 'vitest/config';
import { sep, posix } from 'path';
import { vitestCommonConfig } from '../../vitest.workspace';

export default mergeConfig(
  vitestCommonConfig,
  defineConfig({
    test: { environment: 'jsdom' },
  })
);
