export function image(options = {}) {
	let {
		test = /\.(gif|ico|jpe?g|png)$/,
		exclude,
		include
	} = options

	if (exclude && !Array.isArray(exclude)) exclude = [ exclude ]
	if (include && !Array.isArray(include)) include = [ include ]

	return {
		test, include, exclude,
		use: [{
			loader: 'file-loader',
			query: {
				name: '[path][name].[ext]?[hash:4]'
			}
		}]
	}
}