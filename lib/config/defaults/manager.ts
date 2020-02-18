import path from 'path';

import { getCacheDir, getCoreDir } from '../dist/create';
import { mapToRegex } from '../dist/utils/mapToRegex';

import { PresetMergeAsyncFn } from '../src/types/presets';
import { Webpack } from '../src/types/values';

import loaders, { css, fonts, media, md, mdx, js, mjs } from '../dist/utils/loaders';
import { stats } from '../dist/utils/stats';

const cacheDir = getCacheDir();
const coreDir = getCoreDir();

export const managerWebpack: PresetMergeAsyncFn<Webpack> = async (_, config) => {
  const { default: HtmlWebpackPlugin } = await import('html-webpack-plugin');
  const { default: CaseSensitivePathsPlugin } = await import('case-sensitive-paths-webpack-plugin');
  const { create } = await import('../dist/utils/entrypointsPlugin');

  const { location } = await config.output;

  console.log({ location });
  const e = await config.entries;
  const { entries: entry, plugin } = create(e, {});
  const entryRegex = e.map(mapToRegex);

  return {
    name: 'manager',
    mode: 'development',
    bail: true,
    devtool: false,
    stats,

    entry: {
      main: [`${coreDir}/client/manager/index.js`],
      ...Object.entries(await entry()).reduce(
        (acc, [k, v]) => ({
          ...acc,
          [k.replace('preview', 'metadata')]: v,
        }),
        {}
      ),
    },
    output: {
      path: location,
      filename: '[name].[hash].bundle.js',
      publicPath: '',
    },

    plugins: [
      new HtmlWebpackPlugin({
        filename: `index.html`,
        chunksSortMode: () => 0,
        alwaysWriteToDisk: true,
        inject: false,
        templateParameters: (compilation, files, templateOptions) => ({
          compilation,
          files,
          options: templateOptions,
          version: 1,
          dlls: [],
          headHtmlSnippet: '',
          mains: files.js.filter(i => !i.includes('metadata')),
          examples: files.js.filter(i => i.includes('metadata')),
        }),
        template: require.resolve('@storybook/serve/templates/index.ejs'),
      }),
      new CaseSensitivePathsPlugin(),
      plugin,
    ],

    module: {
      rules: [
        {
          test: entryRegex,
          loader: loaders.managerEntry,
          exclude: [/node_modules/, /dist/],
          options: {
            storybook: true,
          },
        },
        css,
        md,
        fonts,
        media,
        { ...mdx, exclude: [...entryRegex, /node_modules/, /dist/] },
        { ...js, exclude: [...entryRegex, /node_modules/, /dist/] },
        { ...mjs, exclude: [...entryRegex, /dist/] },
      ],
    },

    resolve: {
      extensions: ['.mjs', '.js', '.jsx', '.json'],
      modules: ['node_modules'],
    },
    recordsPath: path.join(cacheDir, 'records.json'),
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
      runtimeChunk: {
        name: 'manager-runtime',
      },
    },
  };
};
