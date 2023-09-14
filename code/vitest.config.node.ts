import { resolve } from 'path';
import baseConfig from './vitest.config.base';

export default {
  ...baseConfig,
  setupFilesAfterEnv: [resolve('./jest.init.base.ts')],
};
