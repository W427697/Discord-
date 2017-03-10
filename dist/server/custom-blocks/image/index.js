'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.image = image;
function image() {
	var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var _options$test = options.test,
	    test = _options$test === undefined ? /\.(gif|ico|jpe?g|png)$/ : _options$test,
	    exclude = options.exclude,
	    include = options.include;


	if (exclude && !Array.isArray(exclude)) exclude = [exclude];
	if (include && !Array.isArray(include)) include = [include];

	return {
		test: test, include: include, exclude: exclude,
		use: [{
			loader: 'file-loader',
			query: {
				name: '[path][name].[ext]?[hash:4]'
			}
		}]
	};
}