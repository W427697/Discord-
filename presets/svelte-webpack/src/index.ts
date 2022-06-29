import type { StorybookConfig } from './types';

export * from './types';

export const addons: StorybookConfig['addons'] = [
  require.resolve('./framework-preset-svelte'),
  require.resolve('./framework-preset-svelte-docs'),
];
