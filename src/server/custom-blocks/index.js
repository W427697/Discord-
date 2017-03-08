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
					require.resolve('react')
				],
				plugins: [
					require.resolve('transform-object-rest-spread'),
					require.resolve('transform-class-properties'),
					require.resolve('react-require')
				]
			}
		}]
	}
}

export function css(options = {}) {
	let {
		test = /\.css$/,
		exclude,
		include
	} = options

	if (exclude && !Array.isArray(exclude)) exclude = [ exclude ]
	if (include && !Array.isArray(include)) include = [ include ]

	return {
		test, include, exclude,
		use: [{
			loader: 'style-loader'
		}, {
			loader: 'css-loader'
		}]
	}
}

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