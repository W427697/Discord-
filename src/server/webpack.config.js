import path from 'path';
import webpack from 'webpack';
import { includePaths } from './paths';
import autoprefixer from 'autoprefixer';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';

const managerEntry =
  process.env.DEV_BUILD ?
  path.resolve(__dirname, '../../src/client/manager') :
  path.resolve(__dirname, '../manager');

const config = {
  devtool: '#cheap-module-eval-source-map',
  entry: {
    manager: [
      managerEntry,
    ],
    preview: [
      path.resolve(__dirname, './error_enhancements'),
      'webpack-hot-middleware/client?noInfo=true',
    ],
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].bundle.js',
    publicPath: '/static/',
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new CaseSensitivePathsPlugin(),
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        query: require('./babel.js'),
        include: includePaths,
      },
      {
        test: /\.css?$/,
        include: includePaths,
        loader: 'style!css!postcss'
      },
      {
        test: /\.json$/,
        include: includePaths,
        loader: 'json'
      },
      {
        test: /\.(jpg|png|gif|eot|svg|ttf|woff|woff2)(\?.*)?$/,
        include: includePaths,
        loader: 'file',
        query: {
          name: 'static/media/[name].[ext]'
        }
      },
      {
        test: /\.(mp4|webm)(\?.*)?$/,
        include: includePaths,
        loader: 'url',
        query: {
          limit: 10000,
          name: 'static/media/[name].[ext]'
        }
      },
    ],
  },
  postcss: function() {
    return [autoprefixer];
  }
};

export default config;
