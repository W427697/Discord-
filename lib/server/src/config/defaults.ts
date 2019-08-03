import path from 'path';

import { getCacheDir, getCoreDir } from '@storybook/config';

import { Entries, OutputConfig } from '../types/config';
import { WebpackConfigMerger, WebpackConfig } from '../types/webpack';
import { ServerConfig } from '../types/server';

import loaders, { css, fonts, media, md, mdx, js, mjs } from './loaders';
import { mapToRegex } from '../utils/mapToRegex';

const cacheDir = getCacheDir();
const coreDir = getCoreDir();

export const logLevel = 'info';

export const entries: Entries = [];

export const output: OutputConfig = {
  compress: false,
  location: path.join(cacheDir, 'out'),
  preview: true,
};
const stats: WebpackConfig['stats'] = {
  errorDetails: true,
  errors: true,
  warnings: true,
  colors: false,
  entrypoints: true,
  modules: false,
  assets: false,
  reasons: false,
  source: false,
};

export const managerWebpack: WebpackConfigMerger = async (_, config): Promise<WebpackConfig> => {
  const { default: HtmlWebpackPlugin } = await import('html-webpack-plugin');
  const { default: CaseSensitivePathsPlugin } = await import('case-sensitive-paths-webpack-plugin');
  const { create } = await import('../utils/entrypointsPlugin');

  const { location } = await config.output;
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
        chunksSortMode: 'none',
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
        template: path.join(__dirname, '..', 'templates', 'index.ejs'),
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

export const webpack: WebpackConfigMerger = async (_, config): Promise<WebpackConfig> => {
  const { default: HtmlWebpackPlugin } = await import('html-webpack-plugin');
  const { default: CaseSensitivePathsPlugin } = await import('case-sensitive-paths-webpack-plugin');
  const { create } = await import('../utils/entrypointsPlugin');

  const { location } = await config.output;
  const e = await config.entries;
  const { entries: entry, plugin } = create(e, {});
  const entryRegex = e.map(mapToRegex);

  return {
    name: 'preview',
    mode: 'development',
    bail: true,
    devtool: false,
    stats,

    entry: await entry(),
    output: {
      path: location,
      filename: '[name].[hash].bundle.js',
      publicPath: '',
    },

    plugins: [
      new HtmlWebpackPlugin({
        filename: `iframe.html`,
        chunksSortMode: 'none',
        alwaysWriteToDisk: true,
        inject: false,
        templateParameters: (compilation, files, templateOptions) => ({
          compilation,
          files,
          options: templateOptions,
          version: 1,
          dlls: [],
          headHtmlSnippet: '',
          mains: files.js.filter(i => !i.includes('preview')),
          examples: files.js.filter(i => i.includes('preview')),
        }),
        template: path.join(__dirname, '..', 'templates', 'index.ejs'),
      }),
      new CaseSensitivePathsPlugin(),
      plugin,
    ],

    module: {
      rules: [
        {
          test: e.map(mapToRegex),
          loader: loaders.previewEntry,
          exclude: /node_modules/,
          options: {
            storybook: true,
          },
        },
        css,
        md,
        fonts,
        media,
        { ...mdx, exclude: [...entryRegex, /node_modules/] },
        js,
        { ...mjs, exclude: [...entryRegex] },
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
        name: 'preview-runtime',
      },
    },
  };
};

export const server: ServerConfig = {
  port: 5000,
  devPorts: {
    manager: 55550,
    preview: 55551,
  },
  host: 'localhost',
  middleware: [],
  static: [],
};
