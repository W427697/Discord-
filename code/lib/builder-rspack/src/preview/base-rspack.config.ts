import type { Options } from '@storybook/types';
import type { Configuration } from '@rspack/core';

export async function createDefaultRspackConfig(
  storybookBaseConfig: Configuration,
  options: Options
): Promise<Configuration> {
  if (
    options.presetsList?.some((preset) =>
      /@storybook(\/|\\)preset-create-react-app/.test(
        typeof preset === 'string' ? preset : preset.name
      )
    )
  ) {
    return storybookBaseConfig;
  }

  const isProd = storybookBaseConfig.mode !== 'development';

  return {
    ...storybookBaseConfig,
    module: {
      ...storybookBaseConfig.module,
      rules: [
        ...(storybookBaseConfig.module?.rules || []),
        {
          test: /\.(svg|ico|jpg|jpeg|png|apng|gif|eot|otf|webp|ttf|woff|woff2|cur|ani|pdf)(\?.*)?$/,
          type: 'asset/resource',
          generator: {
            filename: isProd
              ? 'static/media/[name].[contenthash:8][ext]'
              : 'static/media/[path][name][ext]',
          },
        },
        {
          test: /\.(mp4|webm|wav|mp3|m4a|aac|oga)(\?.*)?$/,
          type: 'asset',
          parser: {
            dataUrlCondition: {
              maxSize: 10000,
            },
          },
          generator: {
            filename: isProd
              ? 'static/media/[name].[contenthash:8][ext]'
              : 'static/media/[path][name][ext]',
          },
        },
        {
          // any imports from './some-file.md?raw' will be imported as raw string
          // see https://webpack.js.org/guides/asset-modules/#replacing-inline-loader-syntax
          // used to support import raw .md files in MDX
          resourceQuery: /raw/,
          type: 'asset/source',
        },
      ],
    },
    resolve: {
      ...storybookBaseConfig.resolve,
      fallback: {
        crypto: false,
        assert: false,
        ...storybookBaseConfig.resolve?.fallback,
      },
    },
  };
}
