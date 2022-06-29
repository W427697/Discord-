import type { StorybookConfig } from './types';

export * from './types';

export const addons: StorybookConfig['addons'] = [
  require.resolve('./framework-preset-vue'),
  require.resolve('./framework-preset-vue-docs'),
];
