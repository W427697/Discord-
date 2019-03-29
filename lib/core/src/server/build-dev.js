import express from 'express';
import https from 'https';
import http from 'http';
import ip from 'ip';
import favicon from 'serve-favicon';
import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import { logger, colors, instance as npmLog } from '@storybook/node-logger';
import fetch from 'node-fetch';
import Cache from 'file-system-cache';
import findCacheDir from 'find-cache-dir';
import opn from 'opn';
import boxen from 'boxen';
import semver from 'semver';
import { stripIndents } from 'common-tags';
import Table from 'cli-table3';
import prettyTime from 'pretty-hrtime';
import isPlainObject from 'is-plain-object';

import { getStorybookConfigs } from '@storybook/config';

import storybook from './dev-server';
import { getDevCli } from './cli';
import merge from './utils/merge';

const defaultFavIcon = require.resolve('./public/favicon.ico');
const cacheDir = findCacheDir({ name: 'storybook' });
const cache = Cache({
  basePath: cacheDir,
  ns: 'storybook', // Optional. A grouping namespace for items.
});

const writeStats = async (name, stats) => {
  await fs.writeFile(
    path.join(cacheDir, `${name}-stats.json`),
    JSON.stringify(stats.toJson(), null, 2),
    'utf8'
  );
};

async function getServer(app, options) {
  if (!options.https) {
    return http.createServer(app);
  }

  if (!options.sslCert) {
    logger.error('Error: --ssl-cert is required with --https');
    process.exit(-1);
  }

  if (!options.sslKey) {
    logger.error('Error: --ssl-key is required with --https');
    process.exit(-1);
  }

  const sslOptions = {
    ca: await Promise.all((options.sslCa || []).map(ca => fs.readFile(ca, 'utf-8'))),
    cert: await fs.readFile(options.sslCert, 'utf-8'),
    key: await fs.readFile(options.sslKey, 'utf-8'),
  };

  return https.createServer(sslOptions, app);
}

async function applyStatic(app, options) {
  const { staticDir } = options;

  let hasCustomFavicon = false;

  if (staticDir && staticDir.length) {
    await Promise.all(
      staticDir.map(async dir => {
        const staticPath = path.resolve(dir);

        if (await !fs.exists(staticPath)) {
          logger.error(`Error: no such directory to load static files: ${staticPath}`);
          process.exit(-1);
        }

        logger.info(`=> Loading static files from: ${staticPath} .`);
        app.use(express.static(staticPath, { index: false }));

        const faviconPath = path.resolve(staticPath, 'favicon.ico');

        if (await fs.exists(faviconPath)) {
          hasCustomFavicon = true;
          app.use(favicon(faviconPath));
        }
      })
    );
  }

  if (!hasCustomFavicon) {
    app.use(favicon(defaultFavIcon));
  }
}

const updateCheck = async version => {
  let result;
  const time = Date.now();
  try {
    const fromCache = await cache.get('lastUpdateCheck', { success: false, time: 0 });

    // if last check was more then 24h ago
    if (time - 86400000 > fromCache.time) {
      const fromFetch = await Promise.race([
        fetch(`https://storybook.js.org/versions.json?current=${version}`),
        // if fetch is too slow, we won't wait for it
        new Promise((res, rej) => global.setTimeout(rej, 1500)),
      ]);
      const data = await fromFetch.json();
      result = { success: true, data, time };
      await cache.set('lastUpdateCheck', result);
    } else {
      result = fromCache;
    }
  } catch (error) {
    result = { success: false, error, time };
  }
  return result;
};

function listenToServer(server, listenAddr) {
  let serverResolve = () => {};
  let serverReject = () => {};

  const serverListening = new Promise((resolve, reject) => {
    serverResolve = resolve;
    serverReject = reject;
  });

  server.listen(...listenAddr, error => {
    if (error) {
      serverReject(error);
    } else {
      serverResolve();
    }
  });

  return serverListening;
}

function createUpdateMessage(updateInfo, version) {
  let updateMessage;

  try {
    updateMessage =
      updateInfo.success && semver.lt(version, updateInfo.data.latest.version)
        ? stripIndents`
          ${colors.orange(
            `A new version (${chalk.bold(updateInfo.data.latest.version)}) is available!`
          )}

          ${chalk.gray('Read full changelog here:')} ${chalk.gray.underline('https://git.io/fhFYe')}
        `
        : '';
  } catch (e) {
    updateMessage = '';
  }
  return updateMessage;
}

function outputStartupInformation(options) {
  const {
    updateInfo,
    version,
    address,
    networkAddress,
    managerTotalTime,
    previewTotalTime,
  } = options;

  const updateMessage = createUpdateMessage(updateInfo, version);

  const serveMessage = new Table({
    chars: {
      top: '',
      'top-mid': '',
      'top-left': '',
      'top-right': '',
      bottom: '',
      'bottom-mid': '',
      'bottom-left': '',
      'bottom-right': '',
      left: '',
      'left-mid': '',
      mid: '',
      'mid-mid': '',
      right: '',
      'right-mid': '',
      middle: '',
    },
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
  });

  serveMessage.push(
    ['Local:', chalk.cyan(address)],
    ['On your network:', chalk.cyan(networkAddress)]
  );

  const timeStatement = previewTotalTime
    ? `${chalk.underline(prettyTime(managerTotalTime))} for manager and ${chalk.underline(
        prettyTime(previewTotalTime)
      )} for preview`
    : `${chalk.underline(prettyTime(managerTotalTime))}`;

  // eslint-disable-next-line no-console
  console.log(
    boxen(
      stripIndents`
          ${colors.green(`Storybook ${chalk.bold(version)} started`)}
          ${chalk.gray(timeStatement)}

          ${serveMessage.toString()}${updateMessage ? `\n\n${updateMessage}` : ''}
        `,
      { borderStyle: 'round', padding: 1, borderColor: '#F1618C' }
    )
  );
}

async function outputStats(previewStats, managerStats) {
  if (previewStats) {
    await writeStats('preview', previewStats);
  }
  await writeStats('manager', managerStats);
  logger.info(`stats written to => ${chalk.cyan(path.join(cacheDir, '[name].json'))}`);
}

function openInBrowser(address) {
  opn(address).catch(() => {
    logger.error(stripIndents`
      Could not open ${address} inside a browser. If you're running this command inside a
      docker container or on a CI, you need to pass the '--ci' flag to prevent opening a
      browser by default.
    `);
  });
}

export async function buildDevStandalone(options) {
  try {
    const { port, host, extendServer } = options;

    // Used with `app.listen` below
    const listenAddr = [port];

    if (host) {
      listenAddr.push(host);
    }

    const app = express();
    const server = await getServer(app, options);

    if (typeof extendServer === 'function') {
      extendServer(server);
    }

    await applyStatic(app, options);

    const {
      router: storybookMiddleware,
      previewStats,
      managerStats,
      managerTotalTime,
      previewTotalTime,
    } = await storybook(options);

    app.use(storybookMiddleware);

    const serverListening = listenToServer(server, listenAddr);
    const { version } = options.packageJson;

    const [updateInfo] = await Promise.all([updateCheck(version), serverListening]);

    const proto = options.https ? 'https' : 'http';
    const address = `${proto}://${options.host || 'localhost'}:${port}/`;
    const networkAddress = `${proto}://${ip.address()}:${port}/`;

    outputStartupInformation({
      updateInfo,
      version,
      address,
      networkAddress,
      managerTotalTime,
      previewTotalTime,
    });

    if (options.smokeTest) {
      await outputStats(previewStats, managerStats);

      let warning = 0;

      if (!options.ignorePreview) {
        warning += previewStats.toJson().warnings.length;
      }

      warning += managerStats.toJson().warnings.length;

      process.exit(warning ? 1 : 0);
    } else if (!options.ci) {
      openInBrowser(address);
    }
  } catch (error) {
    // this is a weird bugfix, somehow 'node-pre-gyp' is poluting the npmLog header
    npmLog.heading = '';

    logger.line();
    logger.warn(
      error.close
        ? stripIndents`
            FATAL broken build!, will close the process,
            Fix the error below and restart storybook.
          `
        : stripIndents`
            Broken build, fix the error below.
            You may need to refresh the browser.
          `
    );
    logger.line();
    if (error instanceof Error) {
      if (error.error) {
        logger.error(error.error);
      } else if (error.stats && error.stats.compilation.errors) {
        error.stats.compilation.errors.forEach(e => logger.plain(e));
      } else {
        logger.error(error);
      }

      if (error.close) {
        process.exit(1);
      }
    }
    if (options.smokeTest) {
      process.exit(1);
    }
  }
}

const faviconLocation = location => path.resolve(location, 'favicon.ico');
const containsFavicon = async location => fs.exists(faviconLocation(location));

const staticMiddleware = config => async app => {
  const list = Object.entries(config);

  const hasCustomFavicon = await list.reduce(async (acc, [route, location]) => {
    const fullLocation = path.resolve(location);

    if (await !fs.exists(fullLocation)) {
      logger.error(`Error: no such directory to load static files: "${fullLocation}"`);
    } else {
      logger.info(`=> Loading static files from: "${location}", hosting them at "${route}"`);
    }

    app.use(express.static(fullLocation, { index: false }));

    // if route is root and we haven't found a favicon before and this one contains a favicon
    if (route === '/' && !(await acc) && (await containsFavicon(fullLocation))) {
      app.use(favicon(faviconLocation(fullLocation)));
      return true;
    }
    return acc;
  }, Promise.resolve(false));

  if (!hasCustomFavicon) {
    app.use(favicon(defaultFavIcon));
  }
};

const createStaticPathsConfig = (fromCli = [], fromConfig = {}) => ({
  ...fromConfig,
  ...fromCli.reduce((acc, p) => ({ ...acc, '/': p }), {}),
});

const pick = allowed => subject =>
  Object.entries(subject).reduce((acc, [k, v]) => {
    if (allowed.includes(k)) {
      acc[k] = v;
    }
    return acc;
  }, {});

const camelize = str =>
  str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) =>
      index === 0 ? letter.toLowerCase() : letter.toUpperCase()
    )
    .replace(/\s+/g, '');

const prefixed = (type, key) => (type ? camelize(`${type} ${key}`) : key);

const createBuildConfig = (fromCli, fromConfig, additional, type) => {
  // type will prepend 'manager' and camelize the propertyname to managerWebpack
  const picker = pick([
    'entries',
    'addons',
    'logLevel',
    prefixed(type, 'webpack'),
    prefixed(type, 'babel'),
    prefixed(type, 'template'),
    prefixed(type, 'init'),
  ]);

  const cliOptions = picker(fromCli);
  const configOptions = picker(fromConfig);

  const merged = merge(configOptions, cliOptions);

  return {
    entries: merged.entries,
    addons: merged.addons,
    logLevel: merged.logLevel,
    init: merged[prefixed(type, 'init')],
    template: merged[prefixed(type, 'template')],
    webpack: merged[prefixed(type, 'webpack')],
    babel: merged[prefixed(type, 'babel')],
    ...additional,
  };
};

const serverFactory = async options => {
  if (options.ssl) {
    if (!options.ssl.cert) {
      logger.error('Error: --ssl-cert is required with --https');
      process.exit(-1);
    }

    if (!options.ssl.key) {
      logger.error('Error: --ssl-key is required with --https');
      process.exit(-1);
    }

    const sslOptions = {
      ca: await Promise.all((options.ssl.ca || []).map(ca => fs.readFile(ca, 'utf-8'))),
      cert: await fs.readFile(options.ssl.cert, 'utf-8'),
      key: await fs.readFile(options.ssl.key, 'utf-8'),
    };

    return app => https.createServer(sslOptions, app);
  }
  return app => http.createServer(app);
};

const createServer = async (options, app) => {
  const create = await serverFactory(options);
  const server = create(app);

  await options.middleware.forEach(async item => {
    if (typeof item === 'function') {
      await item(app, server);
    }
  });

  return server;
};

const createApp = async () => express();

const createManager = async options => {
  const {
    entries = [],
    addons = [],
    logLevel = 'info',
    init,
    template,
    webpack = async config => config,
    babel = async config => config,
    cache,
    configFile,
  } = options;

  const finalWebpackConfig = await webpack(await import('./manager/manager-webpack.config'));

  console.log({ finalWebpackConfig });
  //
  // const presets = loadPresets(presetsConfig);
  // const config = await loadManagerConfig({
  //   configType,
  //   outputDir,
  //   configDir,
  //   cache,
  //   corePresets: [require.resolve('./manager/manager-preset.js')],
  //   ...options,
  // });
  // if (options.debugWebpack) {
  //   logConfig('Manager webpack config', config, logger);
  // }
  // return new Promise((resolve, reject) => {
  //   webpack(config).watch(
  //     {
  //       aggregateTimeout: 1,
  //       ignored: /node_modules/,
  //     },
  //     (err, stats) => {
  //       managerTotalTime = process.hrtime(startTime);
  //       if (!resolved && (err || stats.hasErrors())) {
  //         const error = new Error('Manager build is broken');
  //         error.error = err;
  //         error.close = true;
  //         error.stats = stats;
  //         logger.line();
  //         logger.line();
  //         try {
  //           previewReject(error);
  //           previewProcess.close();
  //           logger.warn('force closed preview build');
  //         } catch (e) {
  //           logger.warn('Unable to close preview build!');
  //         }
  //         logger.line();
  //         reject(error);
  //       } else {
  //         resolve(stats);
  //       }
  //     }
  //   );
  // });
};

// this function takes 2 functions and returns a single function
// then nests these functions, where the result of fn2 is passed as the first arg to fn1
// the remaining arguments are passed to all functions
const mergeFunctions = (fn1, fn2) => async (base, ...args) =>
  fn1(await fn2(base, ...args), ...args);

// mapping legacy preset keys to newer ones
const legacyPresetKeyMapper = key => {
  if (key === 'webpackFinal') {
    return 'webpack';
  }
  if (key === 'babelDefault') {
    return 'babel';
  }
  return key;
};

// create a new config by applying a preset on it
const applyPreset = (preset, base) => ({
  ...base,

  ...Object.entries(preset).reduce((acc, [k, v]) => {
    if (k && v) {
      // legacy
      const key = legacyPresetKeyMapper(k);

      if (typeof v === 'function') {
        return { ...acc, [key]: base[key] ? mergeFunctions(v, base[key]) : v };
      }
      if (Array.isArray(v)) {
        return { ...acc, [key]: base[key] ? v.concat(base[key]) : v };
      }
      if (isPlainObject(v)) {
        return { ...acc, [key]: base[key] ? merge(v, base[key]) : v };
      }
    }
    return acc;
  }, {}),
});

// this is some bad-ass code right here
// we will recurse into sub-presets, extending the config untill all presets have been handled
// a preset can export presets, and all other config types

// functions should be curried
// arrays should be concatinated
// objects should be merged
const applyPresets = async (presets, base) => {
  return presets.reduce(async (acc, preset) => {
    const value = await acc;

    switch (typeof preset) {
      case 'string': {
        const exists = await fs.exists(preset);
        const m = exists ? await import(preset) : null;

        if (exists && m) {
          const { mpresets, ...rest } = m;
          logger.debug(`applied string-preset: "${preset}"`);
          const newValue = mpresets ? applyPresets(mpresets, value) : value;
          return applyPreset(rest, newValue);
        }
        logger.warn(`unloadable string-preset: "${preset}"`);

        return value;
      }
      case 'object': {
        return applyPreset(preset, value);
      }
      default: {
        return value;
      }
    }
  }, base);
};

// cache for webpack
const createBuildCache = () => ({});

// middleware has access to the app & server, and can add http handlers and routes
const createMiddleware = (fromCli, fromConfig, addition) => {
  const staticContentConfig = createStaticPathsConfig(fromCli.staticDir, fromConfig.server.static);

  return []
    .concat(staticMiddleware(staticContentConfig))
    .concat(fromConfig.server.middleware || [])
    .concat(addition.middleware || []);
};

// main function
const start = async ({ configsFiles, callOptions, cliOptions }) => {
  logger.warn('experimental mono config mode enabled');

  // load relevant config from storybook.config.js
  const { presets: loadedPresets, ...loadedConfig } = await import(configsFiles.node.location);

  // get a list of presets from loaded file, and provided via callOptions
  const presets = []
    .concat(loadedPresets)
    .concat(callOptions.frameworkPresets || [])
    .concat(callOptions.overridePresets || []);

  // recurse over all presets to create the main config
  const storybookConfig = await applyPresets(presets, loadedConfig);

  // create config for running the web server
  const serverConfig = merge(storybookConfig.server, {
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

export async function buildDev({ packageJson, ...callOptions }) {
  const cliOptions = await getDevCli(packageJson);
  const configsFiles = await getStorybookConfigs();

  if (configsFiles) {
    return start({ configsFiles, callOptions, cliOptions });
  }

  return buildDevStandalone({
    // ...fileOptions,
    ...cliOptions,
    ...callOptions,
    configDir: callOptions.configDir || cliOptions.configDir || './.storybook',
    packageJson,
  });
}
