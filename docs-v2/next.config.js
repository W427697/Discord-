/* eslint-disable no-param-reassign */

const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const VisualizerPlugin = require('webpack-visualizer-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
// eslint-disable-next-line
const webpack = require('webpack');

const { ANALYZE, ASSET_PREFIX } = process.env;

const sitemap = (() => {
  try {
    // eslint-disable-next-line global-require
    return require('./lib/sitemap');
  } catch (error) {
    return {};
  }
})();

module.exports = {
  assetPrefix: ASSET_PREFIX || '',
  poweredByHeader: false,
  exportPathMap: () =>
    Object.keys(sitemap).reduce(
      (acc, k) =>
        Object.assign(acc, {
          [k]: sitemap[k].route ? { page: sitemap[k].route } : { page: sitemap[k].files[0].route },
        }),
      {}
    ),
  webpack: (config, { dev }) => {
    if (dev) {
      config.module.rules = config.module.rules.map(rule => {
        if (rule.loader === 'babel-loader') {
          rule.options.presets.push([
            'env',
            {
              targets: {
                chrome: 52,
              },
              modules: false,
              loose: true,
            },
          ]);
          rule.options.cacheDirectory = false;
        }
        return rule;
      });
    } else {
      config.plugins.push(
        new webpack.DefinePlugin({
          'process.env': {
            NODE_ENV: JSON.stringify('production'),
          },
        })
      );
      config.plugins.push(new LodashModuleReplacementPlugin());
    }

    if (ANALYZE) {
      config.devtool = 'source-map';

      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'disabled',
          // analyzerMode: 'server',
          // analyzerPort: 8888,
          // For all options see https://github.com/th0r/webpack-bundle-analyzer#as-plugin
          generateStatsFile: true,
          // Will be available at `.next/stats.json`
          statsFilename: 'stats.json',
        })
      );
      config.plugins.push(
        new VisualizerPlugin({
          filename: './statistics.html',
        })
      );
    }

    // config.plugins.push(new webpack.optimize.UglifyJsPlugin());
    // config.plugins.push(new BabiliPlugin({}, { comments: false }));

    // config.resolve = config.resolve || {};
    // config.resolve.alias = config.resolve.alias || [];
    // config.resolve.alias.react = 'preact-compat/dist/preact-compat';
    // config.resolve.alias['react-dom'] = 'preact-compat/dist/preact-compat';

    return config;
  },
};
