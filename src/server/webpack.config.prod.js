import path from 'path';
import webpack from 'webpack';
import { includePaths } from './paths';
import autoprefixer from 'autoprefixer';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

const entries = {
  preview: [],
  manager: [
    path.resolve(__dirname, '../../src/client/manager'),
  ],
};

const config = {
  bail: true,
  devtool: 'source-map',
  entry: entries,
  output: {
    filename: 'static/[name].bundle.js',
    publicPath: '/static/',
  },
  plugins: [
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"production"' }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true,
        warnings: false
      },
      mangle: {
        screw_ie8: true
      },
      output: {
        comments: false,
        screw_ie8: true
      }
    }),
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        query: require('./babel.prod.js'),
        include: includePaths,
      },
      {
        test: /\.css$/,
        include: includePaths,
        loader: 'style!raw!postcss'
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
      }
    ],
  },

  postcss: function() {
    return [autoprefixer];
  },
};

export default config;
