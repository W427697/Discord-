import https from 'https';
import http from 'http';
import fs from 'fs-extra';
import express from 'express';
import EventEmitter from 'eventemitter3';
import { logger } from '@storybook/node-logger';

import { merge } from '../utils/merge';

import { createMiddleware } from '../middleware';
import { applyPresets, getPresets } from '../presets';

import {
  CallOptions,
  CliOptions,
  ConfigsFiles,
  Express,
  ServerConfig,
  StorybookConfig,
} from '../types';

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

export const run = function run(
  configsFiles: ConfigsFiles,
  cliOptions: CliOptions,
  callOptions: CallOptions
) {
  const runner = new EventEmitter();

  const start = async () => {
    try {
      runner.emit('progress', { message: 'loading node config', progress: 10 });
      const base: StorybookConfig = await import(configsFiles.node.location);

      const presets = getPresets(base, callOptions);

      // recurse over all presets to create the main config
      runner.emit('progress', { message: 'applying presets', progress: 20 });
      const storybookConfig = await applyPresets(presets, base);

      runner.emit('progress', { message: 'creating middleware', progress: 30 });
      const middleware = createMiddleware(cliOptions, storybookConfig, callOptions);

      // create config for running the web server
      runner.emit('progress', { message: 'creating config for server', progress: 50 });

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
        middleware,
      });

      // create the node app & server
      runner.emit('progress', { message: 'creating express app', progress: 80 });
      const app = await createApp();

      runner.emit('progress', { message: 'creating server', progress: 99 });
      const server = await createServer(serverConfig, app);

      runner.emit('progress', { message: 'start listening', progress: 100 });
      runner.emit('success', { message: 'server running' });
    } catch (e) {
      runner.emit('failure', { message: e.message, detail: [e] });
    }
  };

  start();

  return runner;
};
