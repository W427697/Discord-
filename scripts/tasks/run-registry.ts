import detectFreePort from 'detect-port';

import waitOn from 'wait-on';
import { CODE_DIRECTORY } from '../utils/constants';
import { exec } from '../utils/exec';
import type { Task } from '../task';

export async function runRegistry({ dryRun }: { dryRun?: boolean; debug?: boolean }) {
  const controller = new AbortController();

  exec(
    'yarn local-registry --open',
    { cwd: CODE_DIRECTORY, env: { ...process.env, CI: 'true' }, detached: true },
    { dryRun, signal: controller.signal }
  ).catch((err) => {
    // If aborted, we want to make sure the rejection is handled.
    if (!err.killed) {
      controller.abort();
      throw err;
    }
  });
  await waitOn({
    resources: ['http://localhost:6001'],
  });

  return controller;
}

const REGISTRY_PORT = 6001;
export const runRegistryTask: Task = {
  description: 'Run the internal npm server',
  service: true,
  dependsOn: ['publish'],
  async ready() {
    return (await detectFreePort(REGISTRY_PORT)) !== REGISTRY_PORT;
  },
  async run(_, options) {
    return runRegistry(options);
  },
};
