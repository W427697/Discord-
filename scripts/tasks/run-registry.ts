import detectFreePort from 'detect-port';

import type { Task } from '../task';
import { run } from '../run-verdaccio';
import { LOCAL_REGISTRY_PORT } from './utils/constants';

export const runRegistryTask: Task = {
  description: 'Run the internal npm server',
  service: true,
  dependsOn: ['publish'],
  async ready() {
    return (await detectFreePort(LOCAL_REGISTRY_PORT)) !== LOCAL_REGISTRY_PORT;
  },
  async run(_) {
    const controller = new AbortController();

    const stop = await run({ open: true, publish: false });

    controller.signal.addEventListener('abort', () => {
      stop();
    });

    return controller;
  },
};
