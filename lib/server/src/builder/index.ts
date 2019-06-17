// the thing that will setup the fork

import { fork } from 'child_process';
import path from 'path';
import { State } from 'webpackbar';
import EventEmitter from 'eventemitter3';

import { ConfigPrefix, EnvironmentType, CliOptions, ConfigsFiles, CallOptions } from '../types';

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
    runner.emit('progress', { message: 'progress is being made', progress: count });

    if (count === 100) {
      clearInterval(interval);
      runner.emit('success', { message: 'completed all the work', progress: 100 });
    }
  }, 500);

  return runner;
};

export { run, fake };
