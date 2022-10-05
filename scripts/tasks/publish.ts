import { pathExists } from 'fs-extra';
import { resolve } from 'path';

import { exec } from '../utils/exec';
import type { Task } from '../task';

const verdaccioCacheDir = resolve(__dirname, '../../.verdaccio-cache');

export const publish: Task = {
  description: 'Publish the packages of the monorepo to an internal npm server',
  before: ['compile'],
  async ready() {
    return pathExists(verdaccioCacheDir);
  },
  async run(_, { dryRun, debug }) {
    return exec(
      'yarn local-registry --publish',
      {},
      {
        startMessage: '📕 Publishing packages',
        errorMessage: '❌ Failed publishing packages',
        dryRun,
        debug,
      }
    );
  },
};
