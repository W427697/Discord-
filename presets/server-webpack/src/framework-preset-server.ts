import path from 'path';
import type { StorybookConfig } from '@storybook/webpack-tools';

export const webpack: StorybookConfig['webpack'] = (config) => {
  config.module.rules.push({
    type: 'javascript/auto',
    test: /\.stories\.json$/,
    use: path.resolve(__dirname, './loader.js'),
  });

  config.module.rules.push({
    type: 'javascript/auto',
    test: /\.stories\.ya?ml/,
    use: [path.resolve(__dirname, './loader.js'), 'yaml-loader'],
  });

  return config;
};
