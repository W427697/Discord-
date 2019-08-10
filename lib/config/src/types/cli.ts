import { ConfigFiles } from './files';
import { PresetRef } from './presets';
import { Middleware, LogLevel } from './values';

export interface Options {
  configFile: PresetRef;
  cliOptions: CliOptions;
  callOptions: CallOptions;
  envOptions: EnvOptions;
}

export interface CliOptions {
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

export interface CallOptions {
  frameworkPresets: PresetRef[];
  overridePresets: PresetRef[];
  middleware?: Middleware | Middleware[];
}

export interface StartOptions {
  cliOptions: CliOptions;
  callOptions: CallOptions;
  configFiles: ConfigFiles;
}

export interface EnvOptions {
  NODE_ENV: EnvironmentType;
  SB_PORT: number;
}

export type EnvironmentType = 'production' | 'development';
export type ConfigPrefix = 'manager' | 'preview';
