import express from 'express';
import Https from 'https';
import Http from 'http';
import fs from 'fs-extra';
import detectFreePort from 'detect-port';

import { logger } from '@storybook/node-logger';

export type Server = Http.Server | Https.Server;

export type Unpacked<T> = T extends (infer U)[]
  ? U
  : T extends (...args: any[]) => infer U
  ? U
  : T extends Promise<infer U>
  ? U
  : T;

export async function getServer(app: ReturnType<typeof getApp>, options: any): Promise<Server> {
  const { https, sslCert, sslKey, sslCa, extendServer, listenAddr } = options;

  let server: Http.Server | Https.Server;

  if (!https) {
    server = Http.createServer(app);
  } else {
    if (!sslCert) {
      logger.error('Error: --ssl-cert is required with --https');
      process.exit(-1);
    }

    if (!sslKey) {
      logger.error('Error: --ssl-key is required with --https');
      process.exit(-1);
    }

    const sslOptions = {
      ca: await Promise.all((sslCa || []).map((ca: any) => fs.readFile(ca, 'utf-8'))),
      cert: await fs.readFile(sslCert, 'utf-8'),
      key: await fs.readFile(sslKey, 'utf-8'),
    } as any;

    server = Https.createServer(sslOptions, app);
  }

  if (typeof extendServer === 'function') {
    extendServer(server);
  }

  return new Promise((resolve, reject) => {
    server.listen(...listenAddr, (error?: Error) => {
      if (error) {
        reject(error);
      } else {
        resolve(server);
      }
    });
  });
}

export const getPort = (port: number) =>
  detectFreePort(port).catch((error) => {
    logger.error(error);
    process.exit(-1);
  });

export const getApp = () => {
  return express();
};
