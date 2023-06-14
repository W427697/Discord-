import { pathExists } from 'fs-extra';
import { LOCAL_REGISTRY_CACHE_DIRECTORY } from '../utils/constants';
import { run } from '../run-verdaccio';

import type { Task } from '../task';

export const publish: Task = {
  description: 'Publish the packages of the monorepo to an internal npm server',
  dependsOn: ['compile'],
  async ready() {
    return pathExists(LOCAL_REGISTRY_CACHE_DIRECTORY);
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
