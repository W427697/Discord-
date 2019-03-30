import favicon from 'serve-favicon';
import path from 'path';
import express from 'express';
import fs from 'fs-extra';

import { logger } from '@storybook/node-logger';

import {
  Express,
  StaticConfig,
  Middleware,
  CliOptions,
  CallOptions,
  StorybookConfig,
} from './types';

const faviconLocation = (location: string) => path.resolve(location, 'favicon.ico');
const containsFavicon = async (location: string) => fs.pathExists(faviconLocation(location));
const defaultFaviconLocation = faviconLocation(path.join(__dirname, '..', 'assets'));

const staticMiddleware = (config: StaticConfig) => async (app: Express) => {
  const list = Object.entries(config);

  const hasCustomFavicon = await list.reduce(async (acc, [route, location]) => {
    const fullLocation = path.resolve(location);

    if (await !fs.pathExists(fullLocation)) {
      logger.error(`Error: no such directory to load static files: "${fullLocation}"`);
    } else {
      logger.info(`=> Loading static files from: "${location}", hosting them at "${route}"`);
    }

    app.use(express.static(fullLocation, { index: false }));

    // if route is root and we haven't found a favicon before and this one contains a favicon
    if (route === '/' && !(await acc) && (await containsFavicon(fullLocation))) {
      app.use(favicon(faviconLocation(fullLocation)));
      return true;
    }
    return acc;
  }, Promise.resolve(false));

  if (!hasCustomFavicon) {
    app.use(favicon(defaultFaviconLocation));
  }
};

const createStaticPathsConfig = (
  fromCli: string[] = [],
  fromConfig: StaticConfig = {}
): StaticConfig => ({
  ...fromConfig,
  ...fromCli.reduce((acc, p) => ({ ...acc, '/': p }), {}),
});

// middleware has access to the app & server, and can add http handlers and routes
const createMiddleware = (
  fromCli: CliOptions,
  fromConfig: StorybookConfig,
  addition: CallOptions
): Middleware[] => {
  const staticContentConfig = createStaticPathsConfig(
    [fromCli.staticDir],
    fromConfig.server.static
  );

  return []
    .concat(staticMiddleware(staticContentConfig))
    .concat(fromConfig.server.middleware || [])
    .concat(addition.middleware || []);
};

export { createMiddleware };
