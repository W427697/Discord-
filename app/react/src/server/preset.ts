import type { StorybookConfig } from '@storybook/core-common';

export const previewAnnotations: StorybookConfig['previewAnnotations'] = (entries = []) => [
  ...entries,
  require.resolve('@storybook/renderer-react/dist/esm/preview/config'),
];

export const addons: StorybookConfig['addons'] = [
  require.resolve('./framework-preset-react'),
  require.resolve('./framework-preset-react-dom-hack'),
  require.resolve('./framework-preset-cra'),
  require.resolve('./framework-preset-react-docs'),
];
