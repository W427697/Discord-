import { logger } from '@storybook/node-logger';
import type { Express } from 'express';
// eslint-disable-next-line import/no-unresolved
import * as fse from 'fs-extra/esm';
import http from 'http';
import https from 'https';

export async function getServer(
  app: Express,
  options: {
    https?: boolean;
    sslCert?: string;
    sslKey?: string;
    sslCa?: string[];
  }
) {
  if (!options.https) {
    return http.createServer(app);
  }

  if (!options.sslCert) {
    logger.error('Error: --ssl-cert is required with --https');
    process.exit(-1);
  }

  if (!options.sslKey) {
    logger.error('Error: --ssl-key is required with --https');
    process.exit(-1);
  }

  const sslOptions = {
    ca: await Promise.all((options.sslCa || []).map((ca) => fse.readFile(ca, 'utf-8'))),
    cert: await fse.readFile(options.sslCert, 'utf-8'),
    key: await fse.readFile(options.sslKey, 'utf-8'),
  };

  return https.createServer(sslOptions, app);
}
