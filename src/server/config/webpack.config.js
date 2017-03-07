import path from 'path';
import webpack from 'webpack';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import {
  includePaths,
  excludePaths,
  nodeModulesPaths,
  loadEnv,
  nodePaths,
} from './utils';
import babelLoaderConfig from './babel.js';

export default function () {
  const config = {
    devtool: 'eval',
    entry: {
      manager: [
        // TODO: remove require
        //require.resolve('./polyfills'),
        require.resolve('../../client/manager'),
      ],
      preview: [
        // TODO: remove require
        //require.resolve('./polyfills'),
        require.resolve('./globals'),
        `${require.resolve('webpack-hot-middleware/client')}?reload=true`,
      ],
    },
    output: {
      path: path.join(__dirname, 'dist'),
      filename: 'static/[name].bundle.js',
      publicPath: '/',
    },
    plugins: [
      new CaseSensitivePathsPlugin(),
      new webpack.EnvironmentPlugin(loadEnv()),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin(),
      new webpack.NoEmitOnErrorsPlugin()
    ],
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          include: includePaths,
          exclude: excludePaths,
          use: [{
            loader: require.resolve('babel-loader'),
            query: babelLoaderConfig
          }]
        }
      ]
    },
    resolve: {
      // Since we ship with json-loader always, it's better to move extensions to here
      // from the default config.
      extensions: ['.js', '.json', '.jsx'],
      // Add support to NODE_PATH. With this we could avoid relative path imports.
      // Based on this CRA feature: https://github.com/facebookincubator/create-react-app/issues/253
      modules: ['node_modules'],
      alias: {
        // This is to add addon support for NPM2
        '@kadira/storybook-addons': require.resolve('@kadira/storybook-addons'),
      }
    }
  };

  return config;
}