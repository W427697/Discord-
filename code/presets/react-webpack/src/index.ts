import type { StorybookConfig } from './types';

export * from './types';

export const addons: StorybookConfig['addons'] = [
  require.resolve('@junk-temporary-prototypes/preset-react-webpack/dist/framework-preset-react'),
  require.resolve('@junk-temporary-prototypes/preset-react-webpack/dist/framework-preset-cra'),
  require.resolve('@junk-temporary-prototypes/preset-react-webpack/dist/framework-preset-react-docs'),
];
