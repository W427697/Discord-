import { Router } from 'express';

import webpack from 'webpack';
import merge from 'webpack-merge';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import getIndexHtml from './index.html';
import getIframeHtml from './iframe.html';

const defaultDevMiddlewareConfig = {
  noInfo: false,
  compress: true,
  clientLogLevel: 'none',
  watchOptions: {
    ignored: /node_modules/
  },
  stats: 'minimal'
}
const defaultHotMiddlewareConfig = {
  log: false
}
const defaultConfig = {
  entry: {
    manager: [
      require.resolve('../client/manager')
    ],
    preview: [
      `${require.resolve('webpack-hot-middleware/client')}?reload=true`,
    ]
  },
  resolve: {
    alias: {
      '@kadira/storybook-addons': require.resolve('@kadira/storybook-addons')
    }
  }
}

export default function ({
  config,
  webpackDevMiddlewareConfig = {},
  webpackHotMiddlewareConfig = {}
}) {
  // Build the webpack configuration using the development mode
  const webpackConfig = merge(defaultConfig, config)
  const publicPath = webpackConfig.output.publicPath
  const configDevMiddleware = {
    ...defaultDevMiddlewareConfig,
    ...webpackDevMiddlewareConfig,
    publicPath
  }
  const configHotMiddleware = {
    ...defaultHotMiddlewareConfig,
    ...webpackHotMiddlewareConfig
  }

  const compiler = webpack(webpackConfig);
  const router = new Router();
  router.use(webpackDevMiddleware(compiler, configDevMiddleware));
  router.use(webpackHotMiddleware(compiler, configHotMiddleware));

  router.get('/', (req, res) =>
   res.send(getIndexHtml({ publicPath }))
  );
  router.get('/iframe.html', (req, res) =>
   res.send(getIframeHtml({ publicPath }))
  );

  return router;
}
