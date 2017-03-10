'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.babel = babel;
function babel() {
	var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var _options$test = options.test,
	    test = _options$test === undefined ? /\.js$/ : _options$test,
	    exclude = options.exclude,
	    include = options.include;


	if (exclude && !Array.isArray(exclude)) exclude = [exclude];
	if (include && !Array.isArray(include)) include = [include];

	return {
		test: test, include: include, exclude: exclude,
		use: [{
			loader: 'babel-loader',
			query: {
				cacheDirectory: true,
				presets: [require.resolve('babel-preset-react')],
				plugins: [require.resolve('babel-plugin-transform-object-rest-spread'), require.resolve('babel-plugin-transform-class-properties'), require.resolve('babel-plugin-react-require')]
			}
		}]
	};
}