import { dirname, join } from 'path';
import { copy, readFile, writeFile } from 'fs-extra';
import express from 'express';

import { logger } from '@storybook/node-logger';

import { globalExternals } from '@fal-works/esbuild-plugin-global-externals';
import { pnpPlugin } from '@yarnpkg/esbuild-plugin-pnp';
import aliasPlugin from 'esbuild-plugin-alias';

import { getRefs } from '@storybook/core-common';
import { readTemplate, render } from './utils/template';
import { definitions } from './utils/globals';
import {
  BuilderBuildResult,
  BuilderFunction,
  BuilderStartOptions,
  BuilderStartResult,
  Compilation,
  ManagerBuilder,
  StarterFunction,
  Stats,
} from './types';
import { readDeep } from './utils/directory';

const safeResolve = (path: string) => {
  try {
    return Promise.resolve(require.resolve(path));
  } catch (e) {
    return Promise.resolve(false as const);
  }
};

let compilation: Compilation;

export const getConfig: ManagerBuilder['getConfig'] = async (options) => {
  const [addonsEntryPoints, customManagerEntryPoint] = await Promise.all([
    options.presets.apply('managerEntries', []),
    safeResolve(join(options.configDir, 'manager')),
  ]);
  return {
    entryPoints: customManagerEntryPoint
      ? [...addonsEntryPoints, customManagerEntryPoint]
      : addonsEntryPoints,
    outdir: join(options.outputDir || './', 'sb-addons'),
    format: 'esm',
    outExtension: { '.js': '.mjs' },
    loader: { '.js': 'jsx' },
    target: ['chrome100'],
    platform: 'browser',
    bundle: true,
    minify: false,
    sourcemap: true,

    legalComments: 'external',
    plugins: [
      aliasPlugin({
        process: require.resolve('rollup-plugin-node-polyfills/polyfills/process-es6.js'),
        util: require.resolve('rollup-plugin-node-polyfills/polyfills/util.js'),
        assert: require.resolve('browser-assert'),
      }),
      globalExternals(definitions),
      pnpPlugin(),
    ],
    define: {
      'process.env.NODE_ENV': "'production'",
      'process.env': '{}',
      global: 'window',
      module: '{}',
    },
  };
};

export const makeStatsFromError = (err: string) =>
  ({
    hasErrors: () => true,
    hasWarnings: () => false,
    toJson: () => ({ warnings: [] as any[], errors: [err] }),
  } as any as Stats);

export const executor = {
  get: async () => {
    const { build } = await import('esbuild');
    return build;
  },
};

let asyncIterator: ReturnType<StarterFunction> | ReturnType<BuilderFunction>;

export const bail: ManagerBuilder['bail'] = async () => {
  if (asyncIterator) {
    try {
      // we tell the builder (that started) to stop ASAP and wait
      await asyncIterator.throw(new Error());
    } catch (e) {
      //
    }
  }

  if (compilation && compilation.stop) {
    try {
      compilation.stop();
      logger.warn('Force closed manager build');
    } catch (err) {
      logger.warn('Unable to close manager build!');
    }
  }
};

/**
 * This function is a generator so that we can abort it mid process
 * in case of failure coming from other processes e.g. preview builder
 *
 * I am sorry for making you read about generators today :')
 */
const starter: StarterFunction = async function* starterGeneratorFn({
  startTime,
  options,
  router,
}) {
  logger.info('=> Starting manager..');

  const config = getConfig(options);
  const refs = getRefs(options);
  const features = options.presets.apply('features');
  const template = readTemplate('template.ejs');
  const customHead = safeResolve(join(options.configDir, 'manager-head.html'));
  const instance = await executor.get();

  yield;

  compilation = await instance({
    ...(await config),

    watch: true,
  });

  yield;

  const addonsDir = (await config).outdir;
  const coreDir = join(dirname(require.resolve('@storybook/ui/package.json')), 'dist');

  router.use(`/sb-addons`, express.static(addonsDir));
  router.use(`/sb-manager`, express.static(coreDir));

  const addonFiles = await readDeep(addonsDir);

  yield;

  const customHeadRef = await customHead;

  yield;

  const html = render(await template, {
    title: 'it is nice',
    files: {
      js: addonFiles.map((f) => `./sb-addons/${f.path}`),
      css: [],
      favicon: '',
    },
    globals: {
      FEATURES: JSON.stringify(features, null, 2),
      REFS: JSON.stringify(await refs, null, 2),
    },
    head: customHeadRef ? await readFile(customHeadRef, 'utf8') : '',
  });

  router.use(`/`, ({ path }, res, next) => {
    if (path === '/') {
      res.status(200).send(html);
    } else {
      next();
    }
  });

  return {
    bail,
    stats: {
      toJson: () => ({}),
    },
    totalTime: process.hrtime(startTime),
  } as BuilderStartResult;
};

export const start = async (options: BuilderStartOptions) => {
  asyncIterator = starter(options);
  let result;

  do {
    // eslint-disable-next-line no-await-in-loop
    result = await asyncIterator.next();
  } while (!result.done);

  return result.value;
};

/**
 * This function is a generator so that we can abort it mid process
 * in case of failure coming from other processes e.g. preview builder
 *
 * I am sorry for making you read about generators today :')
 */
const builder: BuilderFunction = async function* builderGeneratorFn({ startTime, options }) {
  if (!options.outputDir) {
    throw new Error('outputDir is required');
  }
  logger.info('=> Building manager..');
  const coreDirOrigin = join(dirname(require.resolve('@storybook/ui/package.json')), 'dist');
  const coreDir = join(options.outputDir, `sb-manager`);

  const [config, features, instance] = await Promise.all([
    getConfig(options),
    options.presets.apply('features'),
    executor.get(),
    copy(coreDirOrigin, coreDir),
  ]);

  const addonsDir = config.outdir;
  compilation = await instance({
    ...config,

    minify: true,
    watch: false,
  });
  yield;

  const [template, addonFiles] = await Promise.all([
    readTemplate('template.ejs'),
    readDeep(addonsDir),
  ]);

  yield;

  const html = render(template, {
    title: 'it is nice',
    files: {
      js: addonFiles.map((f) => `./sb-addons/${f.path}`),
      css: [],
      favicon: '',
    },
    globals: {
      FEATURES: JSON.stringify(features, null, 2),
    },
  });

  await writeFile(join(options.outputDir, 'index.html'), html);

  logger.trace({ message: '=> Manager built', time: process.hrtime(startTime) });

  return {
    toJson: () => ({}),
  } as BuilderBuildResult;
};

export const build = async (options: BuilderStartOptions) => {
  asyncIterator = builder(options);
  let result;

  do {
    // eslint-disable-next-line no-await-in-loop
    result = await asyncIterator.next();
  } while (!result.done);

  return result.value;
};

export const corePresets: ManagerBuilder['corePresets'] = [];
export const overridePresets: ManagerBuilder['overridePresets'] = [];
