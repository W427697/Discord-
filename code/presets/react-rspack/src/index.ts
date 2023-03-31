import type { StorybookConfig } from './types';

export * from './types';

export const addons: StorybookConfig['addons'] = [
  require.resolve('./framework-preset-react'),
  require.resolve('./framework-preset-react-docs'),
];
