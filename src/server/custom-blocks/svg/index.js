export function svg(options = {}) {
	let {
		test = /\.svg$/,
		exclude,
		include
	} = options

	if (exclude && !Array.isArray(exclude)) exclude = [ exclude ]
	if (include && !Array.isArray(include)) include = [ include ]

	return {
		test, include, exclude,
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
	}
}