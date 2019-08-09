import { Webpack, Template, Server, Output, LogLevel, Entries } from './values';

export interface ConfigValues {
  entries: Entries;
  logLevel: LogLevel;
  template: string;
  managerTemplate: string;
  webpack: Webpack;
  managerWebpack: Webpack;
  server: Server;
  output: Output;
  [k: string]: unknown;
}

export interface Config {
  entries: Promise<Entries>;
  logLevel: Promise<LogLevel>;
  template: Promise<Template>;
  managerTemplate: Promise<Template>;
  webpack: Promise<Webpack>;
  managerWebpack: Promise<Webpack>;
  server: Promise<Server>;
  output: Promise<Output>;
  [k: string]: Promise<unknown>;
}
