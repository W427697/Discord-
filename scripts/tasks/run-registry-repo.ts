import { AbortController } from 'node-abort-controller';
import detectFreePort from 'detect-port';

import { exec } from '../utils/exec';
import type { Task } from '../task';

const REGISTRY_PORT = 6001;
export const runRegistryRepo: Task = {
  service: true,
  before: ['publish-repo'],
  async ready() {
    return (await detectFreePort(REGISTRY_PORT)) !== REGISTRY_PORT;
  },
  async run({ codeDir }, { dryRun, debug }) {
    const controller = new AbortController();

    exec(
      'CI=true yarn local-registry --open',
      { cwd: codeDir },
      { dryRun, debug, signal: controller.signal as AbortSignal }
    ).catch((err) => {
      // If aborted, we want to make sure the rejection is handled.
      if (!err.killed) throw err;
    });
    await exec('yarn wait-on http://localhost:6001', { cwd: codeDir }, { dryRun, debug });

    return controller;
  },
};
