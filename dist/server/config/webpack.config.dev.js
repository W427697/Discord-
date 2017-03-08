'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  var config = {
    devtool: 'eval',
    entry: {
      manager: [require.resolve('../../client/manager')],
      preview: [require.resolve('webpack/hot/dev-server'), require.resolve('webpack-hot-middleware/client') + '?reload=true']
    },
    output: {
      path: _path2.default.join(__dirname, 'dist'),
      filename: 'static/[name].bundle.js',
      publicPath: '/'
    },
    plugins: [new _caseSensitivePathsWebpackPlugin2.default(), new _webpack2.default.EnvironmentPlugin((0, _utils.loadEnv)()), new _webpack2.default.HotModuleReplacementPlugin(), new _webpack2.default.NamedModulesPlugin(), new _webpack2.default.NoEmitOnErrorsPlugin()],
    module: {
      rules: [{
        test: /\.jsx?$/,
        include: _utils.includePaths,
        exclude: _utils.excludePaths,
        use: [{
          loader: require.resolve('babel-loader'),
          query: _babel2.default
        }]
      }]
    },
    resolve: {
      // Since we ship with json-loader always, it's better to move extensions to here
      // from the default config.
      extensions: ['.js', '.json', '.jsx', '.css'],
      // Add support to NODE_PATH. With this we could avoid relative path imports.
      // Based on this CRA feature: https://github.com/facebookincubator/create-react-app/issues/253
      modules: [_utils.nodeModulesPaths],
      alias: {
        // This is to add addon support for NPM2
        '@kadira/storybook-addons': require.resolve('@kadira/storybook-addons')
      }
    },
    performance: {
      hints: false
    }
  };

  return config;
};

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _caseSensitivePathsWebpackPlugin = require('case-sensitive-paths-webpack-plugin');

var _caseSensitivePathsWebpackPlugin2 = _interopRequireDefault(_caseSensitivePathsWebpackPlugin);

var _utils = require('./utils');

var _babel = require('./babel.js');

var _babel2 = _interopRequireDefault(_babel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }