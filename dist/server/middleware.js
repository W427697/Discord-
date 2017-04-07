'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function (_ref) {
  var configPath = _ref.configPath,
      configName = _ref.configName,
      _ref$webpackDevMiddle = _ref.webpackDevMiddlewareConfig,
      webpackDevMiddlewareConfig = _ref$webpackDevMiddle === undefined ? {} : _ref$webpackDevMiddle,
      _ref$webpackHotMiddle = _ref.webpackHotMiddlewareConfig,
      webpackHotMiddlewareConfig = _ref$webpackHotMiddle === undefined ? {} : _ref$webpackHotMiddle;

  // Build the webpack configuration using the development mode
  var config = (0, _config2.default)(configPath, configName);
  var publicPath = config.output.publicPath;
  var configDevMiddleware = _extends({}, defaultDevMiddlewareConfig, webpackDevMiddlewareConfig, {
    publicPath: publicPath
  });
  var configHotMiddleware = _extends({}, defaultHotMiddlewareConfig, webpackHotMiddlewareConfig);

  var compiler = (0, _webpack2.default)(config);
  var router = new _express.Router();
  router.use((0, _webpackDevMiddleware2.default)(compiler, configDevMiddleware));
  router.use((0, _webpackHotMiddleware2.default)(compiler, configHotMiddleware));

  router.get('/', function (req, res) {
    return res.send((0, _index2.default)({ publicPath: publicPath }));
  });
  router.get('/iframe.html', function (req, res) {
    return res.send((0, _iframe2.default)({ publicPath: publicPath }));
  });

  return router;
};

var _express = require('express');

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _webpackDevMiddleware = require('webpack-dev-middleware');

var _webpackDevMiddleware2 = _interopRequireDefault(_webpackDevMiddleware);

var _webpackHotMiddleware = require('webpack-hot-middleware');

var _webpackHotMiddleware2 = _interopRequireDefault(_webpackHotMiddleware);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _index = require('./index.html');

var _index2 = _interopRequireDefault(_index);

var _iframe = require('./iframe.html');

var _iframe2 = _interopRequireDefault(_iframe);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultDevMiddlewareConfig = {
  noInfo: false,
  compress: true,
  clientLogLevel: 'none',
  watchOptions: {
    ignored: /node_modules/
  },
  stats: 'minimal'
};
var defaultHotMiddlewareConfig = {
  log: false
};