'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (configDir) {
  var storybookConfigPath = _path2.default.resolve(configDir, 'config.js');
  if (!_fs2.default.existsSync(storybookConfigPath)) {
    throw new Error('=> Create a storybook config file in "' + configDir + '/config.js".');
  }

  // Check whether addons.js file exists inside the storybook.
  // Load the default addons.js file if it's missing.
  var storybookAddonsPath = void 0;
  var storybookDefaultAddonsPath = _path2.default.resolve(__dirname, 'addons.js');
  var storybookCustomAddonsPath = _path2.default.resolve(configDir, 'addons.js');
  if (_fs2.default.existsSync(storybookCustomAddonsPath)) {
    logger.info('=> Loading custom addons config.');
    storybookAddonsPath = storybookCustomAddonsPath;
  } else {
    storybookAddonsPath = storybookDefaultAddonsPath;
  }

  // Check whether user has a custom webpack config file and
  // return the (extended) base configuration if it's not available.
  var defaultConfig = buildConfig(storybookAddonsPath, storybookConfigPath);
  var customConfigPath = _path2.default.resolve(configDir, 'webpack.config.js');
  if (_fs2.default.existsSync(customConfigPath)) {
    var customConfig = require(customConfigPath);
    if (typeof customConfig === 'function') {
      logger.info('=> Loading custom webpack config.');
      return customConfig(defaultConfig, 'development');
    }
  }

  logger.info('=> Loading default webpack config.');
  return defaultConfig;
};

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var logger = console;
var buildConfig = function buildConfig(storybookAddonsPath, storybookConfigPath) {
  return {
    entry: {
      manager: [storybookAddonsPath, require.resolve('../client/manager')],
      preview: [require.resolve('webpack-hot-middleware/client') + '?reload=true', storybookConfigPath]
    },
    output: {
      path: _path2.default.join(__dirname, 'dist'),
      filename: '[name].bundle.js',
      publicPath: '/static/'
    },
    resolve: {
      alias: {
        '@kadira/storybook-addons': require.resolve('@kadira/storybook-addons')
      }
    }
  };
};