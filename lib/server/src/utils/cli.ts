import pick from 'lodash.pick';
import { CliOptions } from '../types';

export const cleanCliOptions = (options: CliOptions): CliOptions => {
  return pick(options, [
    'port',
    'host',
    'staticDir',
    'configDir',
    'https',
    'sslCa',
    'sslCert',
    'sslKey',
    'smokeTest',
    'ci',
    'quiet',
    'logLevel',
    'noDll',
    'debugWebpack',
  ]);
};
