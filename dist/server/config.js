'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (configPath) {
	var configFile = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'webpack.config.js';

	var customConfig = require.resolve(configPath, configFile);
	if (_fs2.default.existsSync(customConfig)) {
		logger.info('=> Loading custom webpack config.');
		(0, _webpackMerge2.default)(baseConfig, require(customConfig));
	} else {
		// TODO: add more info
		throw new Error('=> Config not found.');
	}
};

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _webpackMerge = require('webpack-merge');

var _webpackMerge2 = _interopRequireDefault(_webpackMerge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var logger = console;
var baseConfig = {
	entry: {
		manager: [require.resolve('../client/manager')],
		preview: [require.resolve('webpack-hot-middleware/client') + '?reload=true']
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