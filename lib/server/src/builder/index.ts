import fs from 'fs';
import { promisify } from 'util';
import { fork, ChildProcess } from 'child_process';
import path from 'path';

import { State } from 'webpackbar';
import EventEmitter from 'eventemitter3';
import { stripIndent } from 'common-tags';

import { getStorybookCachePath } from '@storybook/config';

import { ConfigPrefix, EnvironmentType, CliOptions, ConfigsFiles, CallOptions } from '../types';

const cacheDir = getStorybookCachePath();

const appendFile = promisify(fs.appendFile);

interface RunParams {
  command: string;
  type: ConfigPrefix;
  env: EnvironmentType;
  cliOptions: CliOptions;
  configsFiles: ConfigsFiles;
  callOptions: CallOptions;
}

interface ProgressEvent {
  type: 'progress';
  data: State;
}
interface SuccessEvent {
  type: 'success';
  data: any;
}
interface FailureEvent {
  type: 'failure';
  err: Error;
  data: any;
}

type Event = ProgressEvent | SuccessEvent | FailureEvent;

const createLog = async (sub: ChildProcess, { command, type }: RunParams) => {
  const logFile = path.join(cacheDir, `./${type}-${command}.log`);

  await appendFile(
    logFile,
    `\n${stripIndent`
    **
    ** Log of ${command} of ${type} at ${new Date().toISOString()}
    **
    `}\n\n`
  );

  const log = fs.createWriteStream(logFile, { flags: 'a' });

  sub.stdout.pipe(log);
  sub.stderr.pipe(log);
};

const run = function run(runParams: RunParams): EventEmitter {
  const runner = new EventEmitter();

  const start = async ({
    command,
    type,
    env,
    cliOptions,
    configsFiles,
    callOptions,
  }: RunParams) => {
    const sub = fork(path.join(__dirname, 'commands', command), [], {
      silent: true,
    });

    await createLog(sub, runParams);
    sub.send({ command: 'init', options: { type, env, cliOptions, configsFiles, callOptions } });

    sub.on('message', (event: Event) => {
      if (event.type === 'progress') {
        runner.emit('progress', event.data);
      } else if (event.type === 'success') {
        runner.emit('success', event.data);
      } else if (event.type === 'failure') {
        runner.emit('failure', event.data);
      }
    });
  };
  // TODO: maybe filter env passed into runner
  start(runParams);

  return runner;
};

const fake = function fake(): EventEmitter {
  const runner = new EventEmitter();
  let count = 0;
  const interval = setInterval(() => {
    count += 1;
    runner.emit('progress', {
      message: `progress is being made [${count}/100]`,
      progress: count,
      status: 'progress',
    });

    if (count === 100) {
      clearInterval(interval);
      runner.emit('success', {
        message: 'completed all the work',
      });
    }
  }, 50);

  return runner;
};

export { run, fake };
