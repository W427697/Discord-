import detectFreePort from 'detect-port';

import type { Task } from '../task';
import { REGISTRY_PORT, run } from '../run-verdaccio';

export const runRegistryTask: Task = {
  description: 'Run the internal npm server',
  service: true,
  dependsOn: ['publish'],
  async ready() {
    return (await detectFreePort(REGISTRY_PORT)) !== REGISTRY_PORT;
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
