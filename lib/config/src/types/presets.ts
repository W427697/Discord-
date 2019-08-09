import { Entries, Server, Template, LogLevel, Webpack, Output } from './values';
import { Config } from './api';

export interface ConfigCollector {
  entries: (PresetProperties['entries'])[];
  logLevel: (PresetProperties['logLevel'])[];
  template: (PresetProperties['template'])[];
  managerTemplate: (PresetProperties['managerTemplate'])[];
  webpack: (PresetProperties['webpack'])[];
  managerWebpack: (PresetProperties['managerWebpack'])[];
  server: (PresetProperties['server'])[];
  output: (PresetProperties['output'])[];
  [k: string]: PresetProp<unknown>[];
}

export type PresetMergeFn<T> = (base: T, config: Config) => T;
export type PresetMergeAsyncFn<T> = (base: T, config: Config) => Promise<T>;
export type PresetProp<T> = T | PresetMergeFn<T> | PresetMergeAsyncFn<T>;
export interface PresetProperties {
  entries: PresetProp<Entries>;
  logLevel: PresetProp<LogLevel>;
  template: PresetProp<Template>;
  managerTemplate: PresetProp<Template>;
  webpack: PresetProp<Webpack>;
  managerWebpack: PresetProp<Webpack>;
  server: PresetProp<Server>;
  output: PresetProp<Output>;
  [k: string]: PresetProp<unknown>;
}
export interface PresetAdditives {
  presets: PresetRef[];
  addons: string[];
}
export type PresetRef = string;
export type PresetFn = () => Promise<Preset>;
export type Preset = Partial<PresetProperties & PresetAdditives>;
