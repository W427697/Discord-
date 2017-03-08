import fs from 'fs'
import path from 'path'
import webpack from 'webpack'
import {
	babel,
	css,
	image,
	svg,
} from './custom-blocks'
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';

const include = path.resolve('./packages')
const exclude = path.resolve('./node_modules')

const packagesPaths = path.resolve('./packages')
const nodeModulesPaths = path.resolve('./node_modules')

const buildConfig = (storybookAddonsPath, storybookConfigPath) => ({
	devtool: 'eval',
	entry: {
		manager: [
			storybookAddonsPath,
			require.resolve('../client/manager')
		],
		preview: [
			`${require.resolve('webpack-hot-middleware/client')}?reload=true`,
			require.resolve(storybookConfigPath)
		]
	},
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'static/[name].bundle.js',
		publicPath: '/',
	},
	plugins: [
	new CaseSensitivePathsPlugin(),
	new webpack.EnviromentPlugin({ NODE_ENV: 'development' }),
	new webpack.HotModuleReplacemenPlugin(),
	new webpack.NamedModulesPlugin(),
	new webpack.NoEmitOnErrorsPluign()
	],
	module: {
		rules: {
			...babel({ include, exclude }),
			...css({ include, exclude }),
			...image({ include, exclude }),
			...svg({ include, exclude })
		}
	},
	resolve: {
		extensins: ['.js', '.json', '.jsx', '.css'],
		modules: [nodeModulesPaths, packagesPaths],
		alias: {
			'@kadira/storybook-addons': require.resolve('@kadira/storybook-addons')
		}
	},
	performance: {
		hints: false
	}
})

export default function(configDir) {
	const storybookConfigPath = path.resolve(configDir, 'config.js')
  if (!fs.existsSync(storybookConfigPath)) {
    throw new Error(`=> Create a storybook config file in "${configDir}/config.js".`)
  }

  // Check whether addons.js file exists inside the storybook.
  // Load the default addons.js file if it's missing.
  let storybookAddonsPath;
  const storybookDefaultAddonsPath = path.resolve(__dirname, 'addons.js');
  const storybookCustomAddonsPath = path.resolve(configDir, 'addons.js');
  if (fs.existsSync(storybookCustomAddonsPath)) {
    logger.info('=> Loading custom addons config.');
    storybookAddonsPath = storybookCustomAddonsPath;
  } else {
  	storybookAddonsPath = storybookDefaultAddonsPath;
  }

  // Check whether user has a custom webpack config file and
  // return the (extended) base configuration if it's not available.
  const defaultConfig = buildConfig(storybookAddonsPath, storybookConfigPath)
  const customConfigPath = path.resolve(configDir, 'webpack.config.js')
  if (fs.existsSync(customConfigPath)) {
  	const customConfig = require.resolve(customConfigPath)
  	if (typeof customConfig === 'function') {
  		logger.info('=> Loading custom webpack config.')
  		return customConfig(defaultConfig, 'development')
  	}
  }

  logger.info('=> Loading default webpack config.')
  return defaultConfig
}