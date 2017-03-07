import path from 'path';
import webpack from 'webpack';
import babelLoaderConfig from './babel.prod.js';
import {
  includePaths,
  excludePaths,
  loadEnv,
  nodeModulesPaths,
} from './utils';

export default function () {
  const entries = {
    preview: [
      require.resolve('./globals'),
    ],
    manager: [
      path.resolve(__dirname, '../../client/manager'),
    ],
  };

  const config = {
    bail: true,
    devtool: '#cheap-module-source-map',
    entry: entries,
    output: {
      filename: 'static/[name].[chunkhash].bundle.js',
      // Here we set the publicPath to ''.
      // This allows us to deploy storybook into subpaths like GitHub pages.
      // This works with css and image rules too.
      // This is working for storybook since, we don't use pushState urls and
      // relative URLs works always.
      publicPath: '',
    },
    plugins: [
      new webpack.EnvironmentPlugin(loadEnv({ production: true })),
      new webpack.NamedModulesPlugin(),
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false,
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          screw_ie8: true,
          warnings: false,
        },
        mangle: false,
        output: {
          comments: false,
          screw_ie8: true,
        },
      }),
    ],
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          include: includePaths,
          exclude: excludePaths,
          use: [{
            loader: require.resolve('babel-loader'),
            query: babelLoaderConfig,
          }],
        },
      ],
    },
    resolve: {
      // Since we ship with json-loader always, it's better to move extensions to here
      // from the default config.
      extensions: ['.js', '.json', '.jsx', '.css'],
      // Add support to NODE_PATH. With this we could avoid relative path imports.
      // Based on this CRA feature: https://github.com/facebookincubator/create-react-app/issues/253
      modules: [nodeModulesPaths],
      alias: {
        // This is to add addon support for NPM2
        '@kadira/storybook-addons': require.resolve('@kadira/storybook-addons'),
      },
    },
  };

  return config;
}
