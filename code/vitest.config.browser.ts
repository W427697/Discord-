import { resolve } from 'path';
import baseConfig from './vitest.config.base';

export default {
  ...baseConfig,
  setupFilesAfterEnv: [resolve('./jest.init.browser.ts')],
  testEnvironment: 'vitest-environment-jsdom',
  setupFiles: ['raf/polyfill'],
};
