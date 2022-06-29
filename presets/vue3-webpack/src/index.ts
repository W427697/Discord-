import type { StorybookConfig } from './types';

export * from './types';

export const addons: StorybookConfig['addons'] = [
  require.resolve('./framework-preset-vue3'),
  require.resolve('./framework-preset-vue3-docs'),
];
