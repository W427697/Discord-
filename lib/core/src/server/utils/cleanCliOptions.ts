import pick from 'lodash/pick';

export type LogLevel = 'silly' | 'verbose' | 'info' | 'warn' | 'error' | 'silent';

interface CliOptions {
  port: number;
  host: string;
  staticDir: string[];
  configDir: string;
  outputDir: string;
  https: boolean;
  sslCa: string;
  sslCert: string;
  sslKey: string;
  smokeTest: boolean;
  ci: boolean;
  quiet: boolean;
  logLevel: LogLevel;
  noDll: boolean;
  debugWebpack: boolean;
}

export const cleanCliOptions = (options: CliOptions): CliOptions => {
  return pick(options, [
    'ci',
    'configDir',
    'debugWebpack',
    'host',
    'https',
    'logLevel',
    'noDll',
    'outputDir',
    'port',
    'quiet',
    'smokeTest',
    'sslCa',
    'sslCert',
    'sslKey',
    'staticDir',
  ]);
};
