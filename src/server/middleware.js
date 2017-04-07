import { Router } from 'express';

import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import loadConfig from './config'

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

export default function ({
  configPath,
  configName,
  webpackDevMiddlewareConfig = {},
  webpackHotMiddlewareConfig = {}
}) {
  // Build the webpack configuration using the development mode
  const config = loadConfig(configPath, configName)
  const publicPath = config.output.publicPath
  const configDevMiddleware = {
    ...defaultDevMiddlewareConfig,
    ...webpackDevMiddlewareConfig,
    publicPath
  }
  const configHotMiddleware = {
    ...defaultHotMiddlewareConfig,
    ...webpackHotMiddlewareConfig
  }

  const compiler = webpack(config);
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
