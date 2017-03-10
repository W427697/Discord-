export function babel(options = {}) {
	let {
		test = /\.js$/,
		exclude,
		include
	} = options

	if (exclude && !Array.isArray(exclude)) exclude = [ exclude ]
	if (include && !Array.isArray(include)) include = [ include ]

	return {
		test, include, exclude,
		use: [{
			loader: 'babel-loader',
			query: {
				cacheDirectory: true,
				presets: [
					require.resolve('babel-preset-react')
				],
				plugins: [
					require.resolve('babel-plugin-transform-object-rest-spread'),
					require.resolve('babel-plugin-transform-class-properties'),
					require.resolve('babel-plugin-react-require')
				]
			}
		}]
	}
}