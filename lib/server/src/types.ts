import { Express } from 'express';
import https from 'https';
import http from 'http';

import { Configuration as WebpackConfig } from 'webpack';

type EnviromentType = 'production' | 'development';
type LogLevels = 'silly' | 'verbose' | 'info' | 'warn' | 'error' | 'silent';

interface BabelConfig {
  [key: string]: any;
}

interface OutputConfig {
  location?: string;
  compress?: boolean;
  preview?: boolean | string;
}

interface StorybookConfig {
  presets?: Preset[];
  addons?: string[];
  entries?: string[];
  logLevel?: LogLevels;
  template?: string;
  managerTemplate?: string;
  webpack?: (base: WebpackConfig, env?: EnviromentType, ...args: any[]) => Promise<WebpackConfig>;
  managerWebpack?: (
    base: WebpackConfig,
    env?: EnviromentType,
    ...args: any[]
  ) => Promise<WebpackConfig>;
  babel?: (base: BabelConfig, env?: EnviromentType, ...args: any[]) => Promise<BabelConfig>;
  managerBabel?: (base: BabelConfig, env?: EnviromentType, ...args: any[]) => Promise<BabelConfig>;
  server?: ServerConfig;
  output?: OutputConfig;
}

type Middleware = (app: Express, server?: Server) => Promise<void>;
type Preset = string | (() => Promise<StorybookConfig>);

interface StaticConfig {
  [route: string]: string;
}
type Server = http.Server | https.Server;
interface ServerConfig {
  ssl?: {
    ca: string[];
    cert: string;
    key: string;
  };
  middleware?: Middleware | Middleware[];
  static?: StaticConfig;
}

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
  logLevel: LogLevels;
  noDll: boolean;
  debugWebpack: boolean;
}

interface CallOptions {
  frameworkPresets: Preset[];
  overridePresets: Preset[];
  middleware?: Middleware | Middleware[];
}

interface ConfigFile {
  source: string;
  location: string;
}

interface ConfigsFiles {
  node: ConfigFile;
  manager: ConfigFile;
  preview: ConfigFile;
}

interface StartOptions {
  cliOptions: CliOptions;
  callOptions: CallOptions;
  configsFiles: ConfigsFiles;
}

interface BuildConfig {
  entries: string[];
  addons: string[];
  logLevel: LogLevels;
  webpack?: (base: WebpackConfig, env?: EnviromentType, ...args: any[]) => Promise<WebpackConfig>;
  babel?: (base: BabelConfig, env?: EnviromentType, ...args: any[]) => Promise<BabelConfig>;
  configFile: ConfigFile;
  template?: string;
  output?: OutputConfig;
}

type ConfigPrefix = 'manager' | 'preview';

export {
  BabelConfig,
  BuildConfig,
  CallOptions,
  CliOptions,
  ConfigFile,
  ConfigPrefix,
  ConfigsFiles,
  EnviromentType,
  Express,
  LogLevels,
  Middleware,
  OutputConfig,
  Preset,
  Server,
  ServerConfig,
  StartOptions,
  StaticConfig,
  StorybookConfig,
  WebpackConfig,
};
