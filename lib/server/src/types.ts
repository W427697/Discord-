import { Express } from 'express';
import https from 'https';
import http from 'http';

import { Configuration as WebpackConfig } from 'webpack';

export type EnvironmentType = 'production' | 'development';
export type LogLevels = 'silly' | 'verbose' | 'info' | 'warn' | 'error' | 'silent';

export interface BabelConfig {
  [key: string]: any;
}

export { Express };

export { WebpackConfig };

export interface ProgressDescription {
  message: string;
  progress?: number;
  detail?: string[];
}

export interface State {
  server: ProgressDescription;
  manager: ProgressDescription;
  preview: ProgressDescription;
}

export type ValidStateKeys = keyof State;

export interface OutputConfig {
  location?: string;
  compress?: boolean;
  preview?: boolean | string;
}

export interface StorybookConfig {
  presets?: Preset[];
  addons?: string[];
  entries?: string[];
  logLevel?: LogLevels;
  template?: string;
  managerTemplate?: string;
  webpack?: (base: WebpackConfig, env?: EnvironmentType, ...args: any[]) => Promise<WebpackConfig>;
  managerWebpack?: (
    base: WebpackConfig,
    env?: EnvironmentType,
    ...args: any[]
  ) => Promise<WebpackConfig>;
  babel?: (base: BabelConfig, env?: EnvironmentType, ...args: any[]) => Promise<BabelConfig>;
  managerBabel?: (base: BabelConfig, env?: EnvironmentType, ...args: any[]) => Promise<BabelConfig>;
  server?: ServerConfig;
  output?: OutputConfig;
}

export type Middleware = (app: Express, server?: Server) => Promise<void>;
export type Preset = string | (() => Promise<StorybookConfig>);

export interface StaticConfig {
  [route: string]: string;
}
export type Server = http.Server | https.Server;
export interface ServerConfig {
  ssl?: {
    ca: string[];
    cert: string;
    key: string;
  };
  middleware?: Middleware | Middleware[];
  static?: StaticConfig;
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
  logLevel: LogLevels;
  noDll: boolean;
  debugWebpack: boolean;
}

export interface CallOptions {
  frameworkPresets: Preset[];
  overridePresets: Preset[];
  middleware?: Middleware | Middleware[];
}

export interface ConfigFile {
  source: string;
  location: string;
}

export interface ConfigsFiles {
  node: ConfigFile;
  manager: ConfigFile;
  preview: ConfigFile;
}

export interface StartOptions {
  cliOptions: CliOptions;
  callOptions: CallOptions;
  configsFiles: ConfigsFiles;
}

export interface BuildConfig {
  entries: string[];
  addons: string[];
  logLevel: LogLevels;
  webpack?: (base: WebpackConfig, env?: EnvironmentType, ...args: any[]) => Promise<WebpackConfig>;
  babel?: (base: BabelConfig, env?: EnvironmentType, ...args: any[]) => Promise<BabelConfig>;
  configFile: ConfigFile;
  template?: string;
  output?: OutputConfig;
}

export type ConfigPrefix = 'manager' | 'preview';
