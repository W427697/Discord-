'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.babel = babel;
exports.css = css;
exports.image = image;
exports.svg = svg;
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
				presets: [require.resolve('react')],
				plugins: [require.resolve('transform-object-rest-spread'), require.resolve('transform-class-properties'), require.resolve('react-require')]
			}
		}]
	};
}

function css() {
	var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var _options$test2 = options.test,
	    test = _options$test2 === undefined ? /\.css$/ : _options$test2,
	    exclude = options.exclude,
	    include = options.include;


	if (exclude && !Array.isArray(exclude)) exclude = [exclude];
	if (include && !Array.isArray(include)) include = [include];

	return {
		test: test, include: include, exclude: exclude,
		use: [{
			loader: 'style-loader'
		}, {
			loader: 'css-loader'
		}]
	};
}

function image() {
	var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var _options$test3 = options.test,
	    test = _options$test3 === undefined ? /\.(gif|ico|jpe?g|png)$/ : _options$test3,
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

function svg() {
	var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var _options$test4 = options.test,
	    test = _options$test4 === undefined ? /\.svg$/ : _options$test4,
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