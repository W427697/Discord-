import { logger } from '@storybook/node-logger';

import { globalExternals } from '@fal-works/esbuild-plugin-global-externals';
import { ensureFile, readdir, readFile, writeFile } from 'fs-extra';
import { dirname, join } from 'path';
import express from 'express';
import { readTemplate, render } from './utils/template';
import { globals } from './utils/globals';
import {
  BuilderFunction,
  BuilderStartOptions,
  Compilation,
  ManagerBuilder,
  StarterFunction,
  Stats,
} from './types';
import { readDeep } from './utils/directory';

let compilation: Compilation;

export const getConfig: ManagerBuilder['getConfig'] = async (options) => {
  const entryPoints = await options.presets.apply('managerEntries', []);

  return {
    entryPoints,
    outdir: join(options.outputDir || './', 'sb-addons'),
    format: 'esm',
    outExtension: { '.js': '.mjs' },
    target: ['chrome100'],
    bundle: true,
    minify: false,
    plugins: [globalExternals(globals)],
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
    return import('esbuild');
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
  if (!router) {
    throw new Error('no router, no manager');
  }
  if (!options) {
    throw new Error('no options, no manager');
  }

  logger.info('=> Starting manager..');
  const config = await getConfig(options);
  yield;

  const features = await options.presets.apply('features');

  yield;

  const instance = await executor.get();
  yield;

  compilation = await instance.build({
    ...config,

    watch: true,
  });
  yield;

  const addonsDir = config.outdir;
  const coreDir = join(dirname(require.resolve('@storybook/ui/package.json')), 'dist');

  router.use(`/sb-addons`, express.static(addonsDir));
  router.use(`/sb-core`, express.static(coreDir));

  const addonFiles = await readDeep(addonsDir);
  yield;

  const template = render(await readTemplate('template.ejs'), {
    favicon: 'hello!!',
    title: 'it is nice',
    files: {
      js: addonFiles.map((f) => `/sb-addons/${f.path}`),
      css: [],
      favicon: '',
    },
    globals: {
      FEATURES: JSON.stringify(features, null, 2),
    },
  });

  router.use(`/`, ({ path }, res, next) => {
    if (path === '/') {
      res.status(200).send(template);
    } else {
      next();
    }
  });

  const stats = {};

  return {
    bail,
    stats,
    totalTime: process.hrtime(startTime),
  };
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
  logger.info('=> Compiling manager..');

  if (!options) {
    throw new Error('no options, no manager');
  }

  const config = await getConfig(options);
  yield;

  const instance = await executor.get();
  yield;

  compilation = await instance.build({
    ...config,

    outdir: options.outputDir,
  });
  yield;

  return {};
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
