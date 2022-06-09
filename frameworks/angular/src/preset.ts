import type { StorybookConfig } from '@storybook/core-common';

export const previewAnnotations: StorybookConfig['previewAnnotations'] = (entries = []) => [
  ...entries,
  require.resolve('./client/preview/config'),
];

export const addons: StorybookConfig['addons'] = [
  require.resolve('./server/framework-preset-angular'),
  require.resolve('./server/framework-preset-angular-cli'),
  require.resolve('./server/framework-preset-angular-ivy'),
  require.resolve('./server/framework-preset-angular-docs'),
];

export const core = async (config: StorybookConfig['core']) => {
  return {
    ...config,
    builder: require.resolve('@storybook/builder-webpack5'),
  };
};
