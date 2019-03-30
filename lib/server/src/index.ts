import isPlainObject from 'is-plain-object';
import https from 'https';
import http from 'http';
import fs from 'fs-extra';
import express from 'express';

import { logger } from '@storybook/node-logger';

import { merge } from './utils/merge';
import { cleanCliOptions } from './utils/cli';

import { createMiddleware } from './middleware';
import { applyPresets, getPresets } from './presets';
import { build } from './build/run';

import { Express, ServerConfig, StartOptions, StorybookConfig } from './types';

const serverFactory = async (options: ServerConfig) => {
  const { ssl } = options;
  if (ssl) {
    if (!ssl.cert) {
      logger.error('Error: --ssl-cert is required with --https');
      process.exit(-1);
    }

    if (!ssl.key) {
      logger.error('Error: --ssl-key is required with --https');
      process.exit(-1);
    }

    const sslOptions = {
      ca: await Promise.all((ssl.ca || []).map(ca => fs.readFile(ca, 'utf-8'))),
      cert: await fs.readFile(ssl.cert, 'utf-8'),
      key: await fs.readFile(ssl.key, 'utf-8'),
    };

    return (app: Express) => https.createServer(sslOptions, app);
  }
  return (app: Express) => http.createServer(app);
};

const createServer = async (options: ServerConfig, app: Express) => {
  const create = await serverFactory(options);
  const server = create(app);
  const { middleware } = options;

  if (Array.isArray(middleware)) {
    await middleware.forEach(async item => {
      if (typeof item === 'function') {
        await item(app, server);
      }
    });
  }
  if (typeof middleware === 'function') {
    await middleware(app, server);
  }

  return server;
};

const createApp = async () => express();

// main function
const start = async ({ configsFiles, callOptions, cliOptions: cliOptionsRaw }: StartOptions) => {
  logger.warn('experimental mono config mode enabled');

  // filter the cli options
  const cliOptions = cleanCliOptions(cliOptionsRaw);

  // load relevant config from storybook.config.js
  const base: StorybookConfig = await import(configsFiles.node.location);

  const presets = getPresets(base, callOptions);

  // recurse over all presets to create the main config
  const storybookConfig = await applyPresets(presets, base);

  // create config for running the web server
  const serverConfig = merge(storybookConfig.server, {
    host: cliOptions.host,
    port: cliOptions.port,
    ssl: cliOptions.https
      ? {
          ca: cliOptions.sslCa,
          cert: cliOptions.sslCert,
          key: cliOptions.sslKey,
        }
      : undefined,
    middleware: createMiddleware(cliOptions, storybookConfig, callOptions),
  });

  // create the node app & server
  const app = await createApp();
  const server = await createServer(serverConfig, app);

  const manager = await build(cliOptions, configsFiles, callOptions, 'manager');

  // create the config for building
  // const buildCache = createBuildCache();

  // const managerConfig = createBuildConfig(
  //   cliOptions,
  //   storybookConfig,
  //   { cache: buildCache, configFile: configsFiles.manager },
  //   'manager'
  // );

  // const previewConfig = createBuildConfig(
  //   cliOptions,
  //   storybookConfig,
  //   { cache: buildCache, configFile: configsFiles.preview },
  //   null
  // );

  // run the manager
  // const manager = await createManager(managerConfig);

  // const {
  //   router: storybookMiddleware,
  //   previewStats,
  //   managerStats,
  //   managerTotalTime,
  //   previewTotalTime,
  // }

  //

  //

  console.dir(
    {
      serverConfig,
      // presets,
      // storybookConfig,
      // previewConfig,
      // managerConfig,
      cliOptions,
      callOptions,
    },
    { depth: 10 }
  );
};

export { start };
