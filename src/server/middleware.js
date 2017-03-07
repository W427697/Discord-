import { Router } from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import getBaseConfig from './config/webpack.config';
import loadConfig from './config';
import getIndexHtml from './index.html';
import getIframeHtml from './iframe.html';
import { getHeadHtml, getMiddleware } from './utils';

export default function (configDir) {
  // Build the webpack configuration using the `getBaseConfig`
  // custom `.babelrc` file and `webpack.config.js` files
  const config = loadConfig('DEVELOPMENT', getBaseConfig(), configDir);
  const middlewareFn = getMiddleware(configDir);

  // remove the leading '/'
  let publicPath = config.output.publicPath;
  if (publicPath[0] === '/') {
    publicPath = publicPath.slice(1);
  }

  const compiler = webpack(config);
  const devMiddlewareOptions = {
    compress: true,
    clientLogLevel: 'none',
    hot: true,
    publicPath: config.output.publicPath,
    watchOptions: {
      ignored: /node_modules/,
    },
    overlay: false,
    stats: {
      colors: true,
      hash: false,
      version: false,
      timings: false,
      assets: false,
      chunks: false,
      chunkModules: false,
      modules: false,
      children: false,
      cached: false,
      reasons: false,
      source: false,
      errorDetails: true,
      chunkOrigins: false,
    },
  };

  const router = new Router();
  router.use(webpackDevMiddleware(compiler, devMiddlewareOptions));
  router.use(webpackHotMiddleware(compiler));

  // custom middleware
  middlewareFn(router);

  router.get('/', function (req, res) {
    res.send(getIndexHtml({ publicPath }));
  });

  router.get('/iframe.html', function (req, res) {
    const headHtml = getHeadHtml(configDir);
    res.send(getIframeHtml({ headHtml, publicPath }));
  });

  return router;
}
