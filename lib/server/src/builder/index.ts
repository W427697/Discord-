// the thing that will setup the fork

import { fork } from 'child_process';
import path from 'path';

import { ConfigPrefix, EnviromentType, CliOptions, ConfigsFiles, CallOptions } from '../types';
import { State } from 'webpackbar';

interface RunParams {
  command: string;
  type: ConfigPrefix;
  env: EnviromentType;
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

const run = async ({ command, type, env, cliOptions, configsFiles, callOptions }: RunParams) => {
  // TODO: maybe filter env passed into runner
  const runner = fork(path.join(__dirname, 'commands', command));

  runner.send({ command: 'init', options: { type, env, cliOptions, configsFiles, callOptions } });

  runner.on('message', (event: Event) => {
    if (event.type === 'progress') {
      console.log(event.data.progress);
    } else if (event.type === 'success') {
      console.log(event.data);
    } else if (event.type === 'failure') {
      console.log(event.err, event.data);
    }
  });
};
export { run };
