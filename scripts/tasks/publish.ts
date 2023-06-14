import { pathExists } from 'fs-extra';
import { resolve } from 'path';
import { run } from '../run-verdaccio';

import type { Task } from '../task';

const verdaccioCacheDir = resolve(__dirname, '../../.verdaccio-cache');

export const publish: Task = {
  description: 'Publish the packages of the monorepo to an internal npm server',
  dependsOn: ['compile'],
  async ready() {
    return pathExists(verdaccioCacheDir);
  },
  async run(_) {
    const controller = new AbortController();

    const stop = await run({ open: false, publish: true });

    controller.signal.addEventListener('abort', () => {
      stop();
    });

    return controller;
  },
};
