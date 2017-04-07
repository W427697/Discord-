import fs from 'fs'
import path from 'path'
import merge from 'webpack-merge'
import webpack from 'webpack'

const logger = console.log;
const common = {
  entry: {
		manager: [
			require.resolve('../client/manager')
		],
		preview: [
			`${require.resolve('webpack-hot-middleware/client')}?reload=true`,
		]
	},
	output: {
		// path: path.join(__dirname, 'dist'),
		// filename: '[name].bundle.js',
		// publicPath: '/static/',
	},
	resolve: {
		alias: {
			'@kadira/storybook-addons': require.resolve('@kadira/storybook-addons')
		}
	}
}

export default function(configPath, configFile = 'webpack.config.js') {
  const customConfig = require.resolve(configPath, configFile)
  if (fs.existsSync(customConfig)) {
    logger('=> Loading custom webpack config.')
	  merge(common, require(customConfig))
  } else {
    // TODO: add more info
  	throw new Error('=> Config not found.')
  }
}