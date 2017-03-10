'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.svg = svg;
function svg() {
	var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var _options$test = options.test,
	    test = _options$test === undefined ? /\.svg$/ : _options$test,
	    exclude = options.exclude,
	    include = options.include;


	if (exclude && !Array.isArray(exclude)) exclude = [exclude];
	if (include && !Array.isArray(include)) include = [include];

	return {
		test: test, include: include, exclude: exclude,
		use: [{
			loader: 'svg-url-loader',
			query: {
				limit: 1024,
				noquotes: true,
				name: '[path][name].[ext]?[hash:4]'
			}
		}, {
			loader: 'image-webpack-loader'
		}]
	};
}