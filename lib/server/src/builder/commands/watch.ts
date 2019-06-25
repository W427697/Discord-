import webpack from 'webpack';
import WebpackBar, { State } from 'webpackbar';

import setTitle from 'node-bash-title';
import {
  createWebpackServePreset,
  createWebpackReporterPreset,
  createStorybookEntryPreset,
} from '../../utils/webpack';

import { applyPresets, getPresets } from '../../presets';
import { createBuildConfig } from '../../config';
import { merge } from '../../utils/merge';

import {
  BuildConfig,
  CallOptions,
  CliOptions,
  ConfigPrefix,
  EnvironmentType,
  StorybookConfig,
  ConfigsFiles,
} from '../../types';

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

const reportProgress = (data: Partial<State>) => process.send({ type: 'progress', data });
const reportSuccess = (stats: webpack.Stats) =>
  process.send({ type: 'success', data: stats.toJson(statOptions) });
const reportError = (err: Error, stats?: webpack.Stats) =>
  process.send({
    type: 'failure',
    data: stats ? stats.toJson(statOptions) : { message: err.message, detail: [err] },
  });

const watch = async (
  env: EnvironmentType,
  config: BuildConfig
): Promise<webpack.Watching | null> => {
  try {
    const webpackConfig = await config.webpack({}, env);
    const compiler = webpack(webpackConfig);

    console.dir({ webpackConfig }, { depth: 20 });

    return compiler.watch(
      {
        aggregateTimeout: 10,
      },
      (err, stats) => {
        // Stats Object
        // Print watch/build result here...
        if (err) {
          reportError(err, stats);
          return;
        }
        if (stats) {
          reportSuccess(stats);
        }
      }
    );
  } catch (e) {
    reportError(e);
    return null;
  }
};

const commands = {
  init: async ({ type, env, cliOptions, configsFiles, callOptions }: Options) => {
    reportProgress({ message: 'loading node config', progress: 10 });
    const base: StorybookConfig = await import(configsFiles.node.location);

    const presets = getPresets(base, callOptions);

    // recurse over all presets to create the main config
    reportProgress({ message: 'applying presets', progress: 20 });
    const storybookConfig = await applyPresets(presets, base);

    const serverConfig = merge(storybookConfig.server, {
      host: cliOptions.host,
      port: cliOptions.port,
    });
    reportProgress({ message: 'creating config for server', progress: 20 });

    const buildConfig: BuildConfig = await createBuildConfig(type, env, cliOptions, callOptions, [
      createWebpackServePreset(type, serverConfig),
      createStorybookEntryPreset(type, storybookConfig),
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

    return watch(env, buildConfig);
  },
  stop: async () => {},
};

type Command = keyof typeof commands;
interface Options {
  type: ConfigPrefix;
  env: EnvironmentType;
  callOptions: CallOptions;
  cliOptions: CliOptions;
  configsFiles: ConfigsFiles;
}

process.on('message', ({ command, options }: { command: Command; options: Options }) => {
  commands[command](options);
  setTitle(`storybook ${command} ${options.type}`);
});
