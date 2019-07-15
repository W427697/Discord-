import path from 'path';
import globToRegExp from 'glob-to-regexp';

import { getCacheDir, getCoreDir } from '@storybook/config';

import { Entries, OutputConfig } from '../types/config';
import { WebpackConfigMerger, WebpackConfig } from '../types/webpack';
import { ServerConfig } from '../types/server';

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

  const { location } = await config.output;

  return {
    name: 'manager',
    mode: 'development',
    bail: true,
    devtool: false,
    stats,

    entry: {
      main: [`${coreDir}/client/manager/index.js`],
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
        }),
        template: path.join(__dirname, '..', 'builder', 'templates', 'index.ejs'),
      }),
      new CaseSensitivePathsPlugin(),
    ],

    resolve: {
      extensions: ['.mjs', '.js', '.jsx', '.json'],
      modules: ['node_modules'],
    },
    recordsPath: path.join(cacheDir, 'records.json'),
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
      runtimeChunk: true,
    },
  };
};

const mapToRegex = (e: string | RegExp) => {
  switch (true) {
    case typeof e === 'string': {
      console.log('converted');
      return globToRegExp(e, { extended: true });
    }
    case e instanceof RegExp: {
      console.log('kept');
      return e;
    }
    default: {
      throw new Error('not supported');
    }
  }
};

export const webpack: WebpackConfigMerger = async (_, config): Promise<WebpackConfig> => {
  const { default: HtmlWebpackPlugin } = await import('html-webpack-plugin');
  const { default: CaseSensitivePathsPlugin } = await import('case-sensitive-paths-webpack-plugin');
  const { create } = await import('../utils/entrypointsPlugin');

  const { location } = await config.output;
  const e = await config.entries;
  const { entries: entry, plugin } = create(e, {});

  console.log(e, e.map(mapToRegex));

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
        }),
        template: path.join(__dirname, '..', 'builder', 'templates', 'index.ejs'),
      }),
      new CaseSensitivePathsPlugin(),
      plugin,
    ],

    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            require.resolve('style-loader'),
            {
              loader: require.resolve('css-loader'),
              options: {
                importLoaders: 1,
              },
            },
          ],
        },
        {
          test: /\.(svg|ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|cur|ani)(\?.*)?$/,
          loader: require.resolve('file-loader'),
          query: {
            name: 'static/media/[name].[hash:8].[ext]',
          },
        },
        {
          test: /\.(mp4|webm|wav|mp3|m4a|aac|oga)(\?.*)?$/,
          loader: require.resolve('url-loader'),
          query: {
            limit: 10000,
            name: 'static/media/[name].[hash:8].[ext]',
          },
        },
        {
          test: /\.js$/,
          loader: require.resolve('babel-loader'),
          exclude: /node_modules/,
          options: {
            rootMode: 'upward',
            sourceType: 'unambiguous',
          },
        },
        {
          test: /\.md$/,
          loader: require.resolve('raw-loader'),
        },
        {
          test: /\.mdx$/,
          exclude: e.map(str => globToRegExp(str, { extended: true })),
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: {
                rootMode: 'upward',
                sourceType: 'unambiguous',
              },
            },
            {
              loader: require.resolve('@mdx-js/loader'),
            },
          ],
        },
        {
          test: e.map(mapToRegex),
          loader: require.resolve('../builder/manager/webpack-loader'),
          exclude: /node_modules/,
        },
        {
          test: /\.mjs$/,
          loader: require.resolve('babel-loader'),
          options: {
            rootMode: 'upward',
            sourceType: 'unambiguous',
          },
        },
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
      runtimeChunk: true,
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
