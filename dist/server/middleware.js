'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (configDir) {
  // Build the webpack configuration using the development mode 
  var config = (0, _webpackDevelopment2.default)(configDir);
  var middlewareFn = (0, _utils.getMiddleware)(configDir);

  // remove the leading '/'
  var publicPath = config.output.publicPath;
  if (publicPath[0] === '/') {
    publicPath = publicPath.slice(1);
  }

  console.log('Webpack dev config: ', config);
  var compiler = (0, _webpack2.default)(config);
  var devMiddlewareOptions = {
    hot: true,
    compress: true,
    clientLogLevel: 'none',
    publicPath: config.output.publicPath,
    watchOptions: {
      ignored: /node_modules/
    },
    overlay: false,
    stats: {
      colors: true
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

var _webpackDevelopment = require('./webpack.development.config');

var _webpackDevelopment2 = _interopRequireDefault(_webpackDevelopment);

var _index = require('./index.html');

var _index2 = _interopRequireDefault(_index);

var _iframe = require('./iframe.html');

var _iframe2 = _interopRequireDefault(_iframe);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }