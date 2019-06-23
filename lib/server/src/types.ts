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

export type Status = 'progress' | 'success' | 'failure';

export interface ProgressDescription {
  message: string;
  progress?: number;
  detail?: string[];
  status: Status;
}

export interface State {
  [name: string]: ProgressDescription;
}

export interface OutputConfig {
  location?: string;
  compress?: boolean;
  preview?: boolean | string;
}

export type ConfigFn<T> = (base: T, env: EnvironmentType) => Promise<T>;

export type Entries = string[];

export interface StorybookConfig {
  presets: PresetRef[];
  addons: string[];
  entries: Entries;
  logLevel: LogLevels;
  template: string;
  managerTemplate: string;
  webpack: ConfigFn<WebpackConfig>;
  managerWebpack: ConfigFn<WebpackConfig>;
  babel: ConfigFn<BabelConfig>;
  managerBabel: ConfigFn<BabelConfig>;
  server: ServerConfig;
  output: OutputConfig;
}

export type Middleware = (app: Express, server?: Server) => Promise<void>;
export type PresetRef = string;
export type PresetFn = () => Promise<Partial<StorybookConfig>>;
export type Preset = Partial<StorybookConfig>;

export interface StaticConfig {
  [route: string]: string;
}
export type Server = http.Server | https.Server;
export interface ServerConfig {
  port: number;
  host: string;
  devPorts: {
    manager: number;
    preview: number;
  };
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
  frameworkPresets: PresetRef[];
  overridePresets: PresetRef[];
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
  webpack?: ConfigFn<WebpackConfig>;
  babel?: ConfigFn<BabelConfig>;
  configFile: ConfigFile;
  template?: string;
  output?: OutputConfig;
}

export type ConfigPrefix = 'manager' | 'preview';
