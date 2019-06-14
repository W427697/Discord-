import webpack from 'webpack';
import { State } from 'webpackbar';

import { createWebpackServePreset, createWebpackReporterPreset } from '../../utils/webpack';

import { createBuildConfig } from '../../config';

import { BuildConfig, CallOptions, CliOptions, ConfigPrefix, EnvironmentType } from '../../types';

const statOptions = {
  all: false,
  modules: true,
  maxModules: 0,
  errors: true,
  warnings: true,
  moduleTrace: true,
  errorDetails: true,
  context: process.cwd(),
};

const reportProgress = (data: State) => process.send({ type: 'progress', data });
const reportSuccess = (stats: webpack.Stats) =>
  process.send({ type: 'success', data: stats.toJson(statOptions) });
const reportError = (err: Error, stats: webpack.Stats) =>
  process.send({ type: 'failure', err, data: stats.toJson(statOptions) });

const watch = async (config: BuildConfig) => {
  const webpackConfig = await config.webpack({});

  const compiler = webpack(webpackConfig);

  const watcher = compiler.watch(
    {
      aggregateTimeout: 10,
    },
    (err, stats) => {
      // Stats Object
      // Print watch/build result here...
      if (err) {
        reportError(err, stats);
      }
      reportSuccess(stats);
    }
  );
};

const commands = {
  init: async ({ type, env, callOptions, cliOptions }: Options) => {
    const buildConfig: BuildConfig = await createBuildConfig(type, env, cliOptions, callOptions, [
      createWebpackServePreset(type),
      createWebpackReporterPreset(type, {
        start: ({ state }) => reportProgress(state),
        change: ({ state }) => reportProgress(state),
        update: ({ state }) => reportProgress(state),
        done: ({ state }) => reportProgress(state),
        progress: ({ state }) => reportProgress(state),
        allDone: ({ state }) => reportProgress(state),
        beforeAllDone: ({ state }) => reportProgress(state),
        afterAllDone: ({ state }) => reportProgress(state),
      }),
    ]);

    return watch(buildConfig);
  },
  stop: async () => {},
};

type Command = keyof typeof commands;
interface Options {
  type: ConfigPrefix;
  env: EnvironmentType;
  callOptions: CallOptions;
  cliOptions: CliOptions;
}

process.on('message', ({ command, options }: { command: Command; options: Options }) => {
  commands[command](options);
});
