import { Express } from 'express';
import https from 'https';
import http from 'http';

import { Configuration as WebpackConfig } from 'webpack';
import { LogLevels } from 'npmlog';

type EnviromentType = 'production' | 'dev';

interface BabelConfig {
  [key: string]: any;
}

interface StorybookConfig {
  presets?: Preset[];
  addons?: string[];
  entries?: string[];
  template?: string;
  webpack: (base: WebpackConfig, env?: EnviromentType, ...args: any[]) => Promise<WebpackConfig>;
  babel: (base: BabelConfig, env?: EnviromentType, ...args: any[]) => Promise<BabelConfig>;
  server: ServerConfig;
}

type Middleware = (app: Express, server?: Server) => Promise<void>;
type Preset = string | ((config: StorybookConfig) => Promise<StorybookConfig>);

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
  staticDir: string;
  configDir: string;
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
  entries?: string[];
  addons?: string[];
  logLevel: LogLevels;
  webpack?: (base: WebpackConfig, env?: EnviromentType, ...args: any[]) => Promise<WebpackConfig>;
  babel?: (base: BabelConfig, env?: EnviromentType, ...args: any[]) => Promise<BabelConfig>;
  cache: {};
  configFile: ConfigFile;
  template?: string;
}

type ConfigPrefix = 'manager' | null;

export {
  Middleware,
  Express,
  Server,
  StaticConfig,
  Preset,
  StorybookConfig,
  ServerConfig,
  CliOptions,
  CallOptions,
  ConfigsFiles,
  ConfigFile,
  StartOptions,
  BuildConfig,
  WebpackConfig,
  BabelConfig,
  ConfigPrefix,
};
