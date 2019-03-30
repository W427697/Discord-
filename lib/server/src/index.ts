import isPlainObject from 'is-plain-object';
import https from 'https';
import http from 'http';
import fs from 'fs-extra';
import express from 'express';
import pick from 'lodash.pick';

import { logger } from '@storybook/node-logger';

import { merge } from './utils/merge';
import { createMiddleware } from './middleware';
import {
  CliOptions,
  BuildConfig,
  Express,
  Preset,
  ServerConfig,
  StartOptions,
  StorybookConfig,
  ConfigFile,
  ConfigPrefix,
} from './types';

const camelize = (subject: string) =>
  subject
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) =>
      index === 0 ? letter.toLowerCase() : letter.toUpperCase()
    )
    .replace(/\s+/g, '');

const prefixed = (type: string | undefined, key: string) =>
  type ? camelize(`${type} ${key}`) : key;

const createBuildConfig = (
  fromCli: CliOptions,
  fromConfig: StorybookConfig,
  additional: {
    cache: {};
    configFile: ConfigFile;
  },
  type: ConfigPrefix
): BuildConfig => {
  // type will prepend 'manager' and camelize the propertyname to managerWebpack
  const allowed = [
    'entries',
    'addons',
    'logLevel',
    prefixed(type, 'webpack'),
    prefixed(type, 'babel'),
    prefixed(type, 'template'),
  ];

  const cliOptions = pick(fromCli, allowed);
  const configOptions = pick(fromConfig, allowed);

  const merged = merge(configOptions, cliOptions);

  return {
    entries: merged.entries,
    addons: merged.addons,
    logLevel: merged.logLevel,

    // @ts-ignore
    template: merged[prefixed(type, 'template')],
    // @ts-ignore
    webpack: merged[prefixed(type, 'webpack')],
    // @ts-ignore
    babel: merged[prefixed(type, 'babel')],
    ...additional,
  };
};

const serverFactory = async (options: ServerConfig) => {
  const { ssl } = options;
  if (ssl) {
    if (!ssl.cert) {
      logger.error('Error: --ssl-cert is required with --https');
      process.exit(-1);
    }

    if (!ssl.key) {
      logger.error('Error: --ssl-key is required with --https');
      process.exit(-1);
    }

    const sslOptions = {
      ca: await Promise.all((ssl.ca || []).map(ca => fs.readFile(ca, 'utf-8'))),
      cert: await fs.readFile(ssl.cert, 'utf-8'),
      key: await fs.readFile(ssl.key, 'utf-8'),
    };

    return (app: Express) => https.createServer(sslOptions, app);
  }
  return (app: Express) => http.createServer(app);
};

const createServer = async (options: ServerConfig, app: Express) => {
  const create = await serverFactory(options);
  const server = create(app);
  const { middleware } = options;

  if (Array.isArray(middleware)) {
    await middleware.forEach(async item => {
      if (typeof item === 'function') {
        await item(app, server);
      }
    });
  }
  if (typeof middleware === 'function') {
    await middleware(app, server);
  }

  return server;
};

const createApp = async () => express();

const createManager = async (options: BuildConfig) => {
  const {
    entries = [],
    addons = [],
    logLevel = 'info',
    template,
    webpack,
    babel,
    cache,
    configFile,
  } = options;

  const finalWebpackConfig = webpack ? await webpack({}) : {};

  console.log({ finalWebpackConfig });
};

// this function takes 2 functions and returns a single function
// then nests these functions, where the result of fn2 is passed as the first arg to fn1
// the remaining arguments are passed to all functions
type MergableFn<X> = (base: X, ...args: any[]) => Promise<X>;
const mergeFunctions = <X>(fn1: MergableFn<X>, fn2: MergableFn<X>) => {
  return async (base: X, ...args: any[]): Promise<X> => {
    return fn1(await fn2(base, ...args), ...args);
  };
};

// mapping legacy preset keys to newer ones
const legacyPresetKeyMapper = (key: string): keyof StorybookConfig => {
  if (key === 'webpackFinal') {
    return 'webpack';
  }
  if (key === 'babelDefault') {
    return 'babel';
  }
  return key as keyof StorybookConfig;
};

type ValueOf<T> = T[keyof T];

// create a new config by applying a preset on it
const applyPreset = (preset: StorybookConfig, base: StorybookConfig) => ({
  ...base,

  ...Object.entries(preset).reduce(
    (acc: StorybookConfig, [k, v]: [keyof StorybookConfig, ValueOf<StorybookConfig>]) => {
      if (k && v) {
        // legacy
        const key = legacyPresetKeyMapper(k);

        switch (key) {
          case 'babel':
          case 'webpack': {
            if (typeof v === 'function') {
              return { ...acc, [key]: base[key] ? mergeFunctions(v, base[key]) : v };
            }
            return acc;
          }
          case 'entries': {
            if (Array.isArray(v)) {
              const existing = base[key] as StorybookConfig['entries'];
              return { ...acc, [key]: base[key] ? [...existing, ...v] : v };
            }
            return acc;
          }
          case 'presets': {
            // if (Array.isArray(v)) {
            //   const existing: StorybookConfig['presets'] = base[key];
            //   return { ...acc, [key]: base[key] ? [...existing, ...v] : v };
            // }
            return acc;
          }
          case 'template': {
            if (typeof v === 'string') {
              return { ...acc, [key]: v };
            }
            return acc;
          }
          case 'server': {
            if (isPlainObject(v)) {
              const existing: StorybookConfig['server'] = base[key];
              return { ...acc, [key]: base[key] ? merge(v, existing) : v };
            }
            return acc;
          }
          default: {
            return acc;
          }
        }
      }
      return acc;
    },
    base
  ),
});

// this is some bad-ass code right here
// we will recurse into sub-presets, extending the config untill all presets have been handled
// a preset can export presets, and all other config types

// functions should be curried
// arrays should be concatinated
// objects should be merged
const applyPresets = async (presets: Preset[], base: StorybookConfig): Promise<StorybookConfig> => {
  return presets.reduce(async (acc: Promise<StorybookConfig>, preset: Preset): Promise<
    StorybookConfig
  > => {
    const value = await acc;

    if (typeof preset === 'function') {
      const m = await preset(value);
      return applyPreset(m, value) as StorybookConfig;
    }
    if (typeof preset === 'string') {
      const exists = await fs.pathExists(preset);
      const m: StorybookConfig | null = exists ? await import(preset) : null;

      if (exists && m) {
        logger.debug(`applying string-preset: "${preset}"`);

        const { presets: mpresets, ...rest } = m;
        const newValue = mpresets ? await applyPresets(mpresets, value) : value;
        return applyPreset(rest, newValue) as StorybookConfig;
      }
      logger.warn(`unloadable string-preset: "${preset}"`);

      return value;
    }

    return value;
  }, Promise.resolve(base));
};

// cache for webpack
const createBuildCache = () => ({});

// main function
const start = async ({ configsFiles, callOptions, cliOptions }: StartOptions) => {
  logger.warn('experimental mono config mode enabled');

  // load relevant config from storybook.config.js
  const { presets: loadedPresets, ...loadedConfig }: StorybookConfig = await import(configsFiles
    .node.location);

  // get a list of presets from loaded file, and provided via callOptions
  const presets: Preset[] = []
    .concat(loadedPresets)
    .concat(callOptions.frameworkPresets || [])
    .concat(callOptions.overridePresets || []);

  // recurse over all presets to create the main config
  const storybookConfig = await applyPresets(presets, loadedConfig);

  // create config for running the web server
  const serverConfig: ServerConfig = merge(storybookConfig.server, {
    host: cliOptions.host,
    port: cliOptions.port,
    ssl: cliOptions.https
      ? {
          ca: cliOptions.sslCa,
          cert: cliOptions.sslCert,
          key: cliOptions.sslKey,
        }
      : undefined,
    middleware: createMiddleware(cliOptions, storybookConfig, callOptions),
  });

  // create the node app & server
  const app = await createApp();
  const server = await createServer(serverConfig, app);

  // create the config for building
  const buildCache = createBuildCache();

  const managerConfig = createBuildConfig(
    cliOptions,
    storybookConfig,
    { cache: buildCache, configFile: configsFiles.manager },
    'manager'
  );

  const previewConfig = createBuildConfig(
    cliOptions,
    storybookConfig,
    { cache: buildCache, configFile: configsFiles.preview },
    null
  );

  // run the manager
  const manager = await createManager(managerConfig);
  // const {
  //   router: storybookMiddleware,
  //   previewStats,
  //   managerStats,
  //   managerTotalTime,
  //   previewTotalTime,
  // }

  //

  //

  console.log({ serverConfig, presets, storybookConfig, previewConfig, managerConfig });
};

export { start };
