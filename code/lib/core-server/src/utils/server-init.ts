import { logger } from '@storybook/node-logger';
import Fastify from 'fastify';
import type { FastifyInstance } from 'fastify';
import { readFile } from 'fs-extra';

const baseOptions = {
  logger: true,
};

export async function serverInit(options: {
  https?: boolean;
  sslCert?: string;
  sslKey?: string;
  sslCa?: string[];
}): Promise<FastifyInstance> {
  if (!options.https) {
    return Fastify(baseOptions);
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
    ca: await Promise.all((options.sslCa || []).map((ca) => readFile(ca, 'utf-8'))),
    cert: await readFile(options.sslCert, 'utf-8'),
    key: await readFile(options.sslKey, 'utf-8'),
  };

  return Fastify({
    ...baseOptions,
    https: sslOptions,
  });
}
