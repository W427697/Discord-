import type { StorybookConfig } from './types';

export * from './types';

export const addons: StorybookConfig['addons'] = [
  require.resolve('@junk-temporary-prototypes/preset-vue-webpack/dist/framework-preset-vue'),
  require.resolve('@junk-temporary-prototypes/preset-vue-webpack/dist/framework-preset-vue-docs'),
];
