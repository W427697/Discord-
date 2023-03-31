import { hasDocsOrControls } from '@storybook/docs-tools';

import type { StorybookConfig } from './types';

export const rspack: StorybookConfig['rspack'] = async (rspackConfig, options) => {
  if (!hasDocsOrControls(options)) return rspackConfig;

  const typescriptOptions = await options.presets.apply<StorybookConfig['typescript']>(
    'typescript',
    {} as any
  );

  const { reactDocgen } = typescriptOptions || {};

  if (typeof reactDocgen !== 'string') {
    return rspackConfig;
  }

  return {
    ...rspackConfig,
    module: {
      ...rspackConfig.module,
      rules: [
        ...(rspackConfig.module?.rules || []),
        {
          test: /\.(tsx?|jsx?)$/,
          exclude: /node_modules/,
          use: {
            loader: require.resolve('babel-loader'),
            options: {
              /* no need to use preset-typescript or preset-react as rspack can handle it */
              plugins: [
                require.resolve('@babel/plugin-syntax-jsx'),
                [require.resolve('@babel/plugin-syntax-typescript'), { isTSX: true }],
                require.resolve('babel-plugin-react-docgen'),
              ],
            },
          },
        },
      ],
    },
  };
};
