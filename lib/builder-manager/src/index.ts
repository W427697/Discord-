import { logger } from '@storybook/node-logger';
import type { Builder } from '@storybook/core-common';

import esbuild from 'esbuild';

import { globalExternals } from '@fal-works/esbuild-plugin-global-externals';
import { readdir, readFile } from 'fs-extra';
import { dirname, join } from 'path';
import { readTemplate, render } from './utils/template';

interface Stats {
  //
  a?: number;
}

type ManagerBuilder = Builder<esbuild.BuildOptions, Stats>;
type Unpromise<T extends Promise<any>> = T extends Promise<infer U> ? U : never;

type BuilderStartOptions = Partial<Parameters<ManagerBuilder['start']>['0']>;
type BuilderStartResult = Unpromise<ReturnType<ManagerBuilder['start']>>;
type StarterFunction = (
  options: BuilderStartOptions
) => AsyncGenerator<unknown, BuilderStartResult, void>;

type BuilderBuildOptions = Partial<Parameters<ManagerBuilder['build']>['0']>;
type BuilderBuildResult = Unpromise<ReturnType<ManagerBuilder['build']>>;
type BuilderFunction = (
  options: BuilderBuildOptions
) => AsyncGenerator<unknown, BuilderBuildResult, void>;

let compilation: esbuild.BuildResult;

const ADDONS_FILENAME = 'addons.js';

export const getConfig: ManagerBuilder['getConfig'] = async (options) => {
  const entryPoints = await options.presets.apply('managerEntries', []);
  const globals = {
    // react: '__REACT__',
    // react: "__REACT__"
  };

  return {
    entryPoints,
    outdir: './',
    outExtension: { '.js': '.mjs' },
    target: ['chrome100'],
    bundle: true,
    minify: true,
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
    return esbuild;
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

  const instance = await executor.get();
  yield;

  compilation = await instance.build({
    ...config,

    write: false,
    watch: true,
  });
  yield;

  router.use(`/sb-addons`, ({ path: selected }, res) => {
    const { contents } =
      compilation?.outputFiles?.find(
        ({ path: file }) => file.replace(process.cwd(), '') === selected
      ) || {};
    if (contents) {
      res.status(200);
      res.contentType('application/javascript');
      res.send(contents);
    }

    res.status(404).send('Not found');
  });

  const dir = join(dirname(require.resolve('@storybook/ui/package.json')), 'dist');
  router.use(`/sb-core`, ({ path: selected }, res) => {
    const base = join(dir, selected);
    readFile(base)
      .then((contents) => {
        res.status(200);
        res.contentType('application/javascript');
        res.send(contents);
      })
      .catch((e) => {
        res.status(400).send(e.message);
      });
  });
  const files = await readdir(dir);

  const template = render(await readTemplate('template.ejs'), {
    favicon: 'hello!!',
    title: 'it is nice',
    files: {
      js: [],
      css: [],
      favicon: '',
    },
    globals: {
      foo: 4,
    },
  });

  router.use(`/`, (req, res) => {
    res.status(200).send(
      `${template}<pre>
        the manager html!
        
        ${JSON.stringify(
          compilation?.outputFiles?.map(({ path: file }) =>
            file.replace(process.cwd(), '/sb-addons')
          ),
          null,
          2
        )}
        
        ${JSON.stringify(
          files?.map((file) => `/sb-core/${file}`),
          null,
          2
        )}
        
        </pre>`
    );
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
