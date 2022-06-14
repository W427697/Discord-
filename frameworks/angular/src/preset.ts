import path from 'path';
import { StorybookConfig } from './types';

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
    builder: path.dirname(
      require.resolve(path.join('@storybook/builder-webpack5', 'package.json'))
    ),
  };
};

export const typescript = async (
  config: StorybookConfig['typescript']
): Promise<StorybookConfig['typescript']> => {
  return {
    ...config,
    skipBabel: true,
  };
};
