import { rspack } from '@rspack/core';
import type { Stats, Configuration, StatsOptions } from '@rspack/core';

import rspackDevMiddleware from '@rspack/dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import { logger } from '@storybook/node-logger';
import type { Builder, Options } from '@storybook/types';
import { dirname, join, parse } from 'path';
import express from 'express';
import fs from 'fs-extra';

import prettyTime from 'pretty-hrtime';

export * from './types';

export const printDuration = (startTime: [number, number]) =>
  prettyTime(process.hrtime(startTime))
    .replace(' ms', ' milliseconds')
    .replace(' s', ' seconds')
    .replace(' m', ' minutes');

const wrapForPnP = (input: string) => dirname(require.resolve(join(input, 'package.json')));

let compilation: ReturnType<typeof rspackDevMiddleware> | undefined;
let reject: (reason?: any) => void;

type RspackBuilder = Builder<Configuration, Stats>;
type Unpromise<T extends Promise<any>> = T extends Promise<infer U> ? U : never;

type BuilderStartOptions = Parameters<RspackBuilder['start']>['0'];
type BuilderStartResult = Unpromise<ReturnType<RspackBuilder['start']>>;
type StarterFunction = (
  options: BuilderStartOptions
) => AsyncGenerator<unknown, BuilderStartResult, void>;

type BuilderBuildOptions = Parameters<RspackBuilder['build']>['0'];
type BuilderBuildResult = Unpromise<ReturnType<RspackBuilder['build']>>;
type BuilderFunction = (
  options: BuilderBuildOptions
) => AsyncGenerator<Stats | undefined, BuilderBuildResult, void>;

export const executor = {
  get: async (options: Options) => {
    const rspackInstance =
      (await options.presets.apply<{ default: typeof rspack }>('rspackInstance'))?.default ||
      rspack;
    return rspackInstance;
  },
};

export const getConfig: RspackBuilder['getConfig'] = async (options) => {
  const { presets } = options;
  // const typescriptOptions = await presets.apply('typescript', {}, options);
  // const babelOptions = await presets.apply('babel', {}, { ...options, typescriptOptions });
  const frameworkOptions = await presets.apply<any>('frameworkOptions');

  return presets.apply(
    'rspack',
    {},
    {
      ...options,
      frameworkOptions,
    }
  ) as any;
};

let asyncIterator: ReturnType<StarterFunction> | ReturnType<BuilderFunction>;

export const bail: RspackBuilder['bail'] = async () => {
  if (asyncIterator) {
    try {
      // we tell the builder (that started) to stop ASAP and wait
      await asyncIterator.throw(new Error());
    } catch (e) {
      //
    }
  }

  if (reject) {
    reject();
  }
  // we wait for the compiler to finish it's work, so it's command-line output doesn't interfere
  return new Promise((res, rej) => {
    if (process && compilation) {
      try {
        compilation.close(() => res());
        logger.warn('Force closed preview build');
      } catch (err) {
        logger.warn('Unable to close preview build!');
        res();
      }
    } else {
      res();
    }
  });
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
  channel,
}) {
  const rspackInstance = await executor.get(options);
  yield;

  const config = await getConfig(options);
  yield;
  const compiler = rspackInstance(config);

  if (!compiler) {
    const err = `${config.name}: missing rspack compiler at runtime!`;
    logger.error(err);
    return {
      bail,
      totalTime: process.hrtime(startTime),
      stats: {
        hasErrors: () => true,
        hasWarnings: () => false,
        toJson: () => ({ warnings: [] as any[], errors: [err] }),
      } as any as Stats,
    };
  }

  yield;

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  config.builtins!.progress = true;

  const middlewareOptions: Parameters<typeof rspackDevMiddleware>[1] = {
    publicPath: config.output?.publicPath as string,
    writeToDisk: true,
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore TODO
  compilation = rspackDevMiddleware(compiler, middlewareOptions);

  const previewResolvedDir = wrapForPnP('@storybook/preview');
  const previewDirOrigin = join(previewResolvedDir, 'dist');

  router.use(`/sb-preview`, express.static(previewDirOrigin, { immutable: true, maxAge: '5m' }));

  router.use(compilation);
  // TODO: rspack hot middleware
  router.use(webpackHotMiddleware(compiler as any, { log: false }));

  const stats = await new Promise<Stats>((ready, stop) => {
    compilation?.waitUntilValid(ready as any);
    reject = stop;
  });
  yield;

  if (!stats) {
    throw new Error('no stats after building preview');
  }

  if (stats.hasErrors()) {
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw stats.toJson().errors;
  }

  return {
    bail,
    stats,
    totalTime: process.hrtime(startTime),
  };
};

/**
 * This function is a generator so that we can abort it mid process
 * in case of failure coming from other processes e.g. manager builder
 *
 * I am sorry for making you read about generators today :')
 */
const builder: BuilderFunction = async function* builderGeneratorFn({ startTime, options }) {
  const rspackInstance = await executor.get(options);
  yield;
  logger.info('=> Compiling preview..');
  const config = await getConfig(options);
  yield;

  const compiler = rspackInstance(config);

  if (!compiler) {
    const err = `${config.name}: missing rspack compiler at runtime!`;
    logger.error(err);
    return {
      hasErrors: () => true,
      hasWarnings: () => false,
      toJson: () => ({ warnings: [] as any[], errors: [err] }),
    } as any as Stats;
  }

  const rspackCompilation = new Promise<Stats>((succeed, fail) => {
    compiler.run((error, stats) => {
      if (error || !stats || stats.hasErrors()) {
        logger.error('=> Failed to build the preview');
        process.exitCode = 1;

        if (error) {
          logger.error(error.message);

          compiler.close(() => fail(error));

          return;
        }

        if (stats && (stats.hasErrors() || stats.hasWarnings())) {
          const { warnings = [], errors = [] } = stats.toJson(
            typeof config.stats === 'string'
              ? config.stats
              : {
                  warnings: true,
                  errors: true,
                  ...(config.stats as StatsOptions),
                }
          );

          errors.forEach((e) => logger.error(e.message));
          warnings.forEach((e) => logger.error(e.message));

          compiler.close(() =>
            options.debugRspack
              ? fail(stats)
              : fail(new Error('=> Rspack failed, learn more with --debug-rspack'))
          );

          return;
        }
      }

      logger.trace({ message: '=> Preview built', time: process.hrtime(startTime) });
      if (stats && stats.hasWarnings()) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- we know it has warnings because of hasWarnings()
        stats
          .toJson({ warnings: true } as StatsOptions)
          .warnings!.forEach((e) => logger.warn(e.message));
      }

      compiler.close(() => {
        return succeed(stats as Stats);
      });
    });
  });

  const previewResolvedDir = wrapForPnP('@storybook/preview');
  const previewDirOrigin = join(previewResolvedDir, 'dist');
  const previewDirTarget = join(options.outputDir || '', `sb-preview`);

  const previewFiles = fs.copy(previewDirOrigin, previewDirTarget, {
    filter: (src) => {
      const { ext } = parse(src);
      if (ext) {
        return ext === '.mjs';
      }
      return true;
    },
  });

  const [rspackCompilationOutput] = await Promise.all([rspackCompilation, previewFiles]);

  return rspackCompilationOutput;
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

export const build = async (options: BuilderStartOptions) => {
  asyncIterator = builder(options);
  let result;

  do {
    // eslint-disable-next-line no-await-in-loop
    result = await asyncIterator.next();
  } while (!result.done);

  return result.value;
};

export const corePresets = [join(__dirname, './presets/preview-preset.js')];
export const overridePresets = [join(__dirname, './presets/custom-rspack-preset.js')];
