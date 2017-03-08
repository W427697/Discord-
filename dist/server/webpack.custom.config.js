'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _caseSensitivePathsWebpackPlugin = require('case-sensitive-paths-webpack-plugin');

var _caseSensitivePathsWebpackPlugin2 = _interopRequireDefault(_caseSensitivePathsWebpackPlugin);

var _webpack3 = require('@webpack-blocks/webpack2');

var _babel = require('@webpack-blocks/babel6');

var _babel2 = _interopRequireDefault(_babel);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = (0, _webpack3.createConfig)([(0, _webpack3.setDevTool)('cheap-module-source-map'), (0, _webpack3.entryPoint)({
	manager: [require.resolve('../../client/manager')],
	preview: [require.resolve('webpack-hot-middleware/client') + '?reload=true']
}), (0, _webpack3.setOutput)({
	path: _path2.default.joint(__dirname, 'dist'),
	filename: 'static/[name].bundle.js',
	publicPath: '/'
}), (0, _webpack3.addPlugins)([new _caseSensitivePathsWebpackPlugin2.default(), new _webpack2.default.EnviromentPlugin((0, _utils.loadEnv)()), new _webpack2.default.HotModuleReplacemenPlugin(), new _webpack2.default.NamedModulesPlugin(), new _webpack2.default.NoEmitOnErrorsPluign()]), (0, _babel2.default)({
	presets: ['react'],
	plugins: ['transform-object-rest-spread', 'transform-class-properties']
}), customConfig({
	resolve: {
		extensins: ['.js', '.json', '.jsx', '.css'],
		modules: [_utils.nodeModulesPaths],
		alias: {
			'@kadira/storybook-addons': require.resolve('@kadira/storybook-addons')
		}
	}
}), (0, _webpack3.performance)({ hints: false })]);