'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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
		var customConfig = require.resolve(customConfigPath);
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

var _customBlocks = require('./custom-blocks');

var _caseSensitivePathsWebpackPlugin = require('case-sensitive-paths-webpack-plugin');

var _caseSensitivePathsWebpackPlugin2 = _interopRequireDefault(_caseSensitivePathsWebpackPlugin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var include = _path2.default.resolve('./packages');
var exclude = _path2.default.resolve('./node_modules');

var packagesPaths = _path2.default.resolve('./packages');
var nodeModulesPaths = _path2.default.resolve('./node_modules');

var buildConfig = function buildConfig(storybookAddonsPath, storybookConfigPath) {
	return {
		devtool: 'eval',
		entry: {
			manager: [storybookAddonsPath, require.resolve('../../client/manager')],
			preview: [require.resolve('webpack-hot-middleware/client') + '?reload=true', require.resolve(storybookConfigPath)]
		},
		output: {
			path: _path2.default.joint(__dirname, 'dist'),
			filename: 'static/[name].bundle.js',
			publicPath: '/'
		},
		plugins: [new _caseSensitivePathsWebpackPlugin2.default(), new _webpack2.default.EnviromentPlugin({ NODE_ENV: 'development' }), new _webpack2.default.HotModuleReplacemenPlugin(), new _webpack2.default.NamedModulesPlugin(), new _webpack2.default.NoEmitOnErrorsPluign()],
		module: {
			rules: _extends({}, (0, _customBlocks.babel)({ include: include, exclude: exclude }), (0, _customBlocks.css)({ include: include, exclude: exclude }), (0, _customBlocks.image)({ include: include, exclude: exclude }), (0, _customBlocks.svg)({ include: include, exclude: exclude }))
		},
		resolve: {
			extensins: ['.js', '.json', '.jsx', '.css'],
			modules: [nodeModulesPaths, packagesPaths],
			alias: {
				'@kadira/storybook-addons': require.resolve('@kadira/storybook-addons')
			}
		},
		performance: {
			hints: false
		}
	};
};