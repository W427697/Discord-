'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (configDir) {
  // Build the webpack configuration using the `getBaseConfig`
  // custom `.babelrc` file and `webpack.config.cusom.js` files
  var config = (0, _config2.default)('DEVELOPMENT', (0, _webpackConfig2.default)(), configDir);
  var middlewareFn = (0, _utils.getMiddleware)(configDir);

  // remove the leading '/'
  var publicPath = config.output.publicPath;
  if (publicPath[0] === '/') {
    publicPath = publicPath.slice(1);
  }

  var compiler = (0, _webpack2.default)(config);
  var devMiddlewareOptions = {
    compress: true,
    clientLogLevel: 'none',
    hot: true,
    publicPath: config.output.publicPath,
    watchOptions: {
      ignored: /node_modules/
    },
    overlay: false,
    stats: {
      colors: true,
      hash: false,
      version: false,
      timings: false,
      assets: false,
      chunks: false,
      chunkModules: false,
      modules: false,
      children: false,
      cached: false,
      reasons: false,
      source: false,
      errorDetails: true,
      chunkOrigins: false
    }
  };

  var router = new _express.Router();
  router.use((0, _webpackDevMiddleware2.default)(compiler, devMiddlewareOptions));
  router.use((0, _webpackHotMiddleware2.default)(compiler));

  // custom middleware
  middlewareFn(router);

  router.get('/', function (req, res) {
    res.send((0, _index2.default)({ publicPath: publicPath }));
  });

  router.get('/iframe.html', function (req, res) {
    var headHtml = (0, _utils.getHeadHtml)(configDir);
    res.send((0, _iframe2.default)({ headHtml: headHtml, publicPath: publicPath }));
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

var _webpackConfig = require('./config/webpack.config.dev');

var _webpackConfig2 = _interopRequireDefault(_webpackConfig);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _index = require('./index.html');

var _index2 = _interopRequireDefault(_index);

var _iframe = require('./iframe.html');

var _iframe2 = _interopRequireDefault(_iframe);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }