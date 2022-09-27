import { pathExists } from 'fs-extra';
import { resolve } from 'path';

import { exec } from '../utils/exec';
import type { Task } from '../task';

export const bootstrapRepo: Task = {
  before: ['install-repo'],
  async ready({ codeDir }) {
    // TODO: Ask norbert
    return pathExists(resolve(codeDir, './lib/store/dist/cjs/index.js'));
  },
  async run() {
    // TODO -- what if they want to do `bootstrap --core`?
    return exec(
      'yarn bootstrap --prep',
      {},
      {
        startMessage: '🥾 Bootstrapping',
        errorMessage: '❌ Failed to bootstrap',
      }
    );
  },
};
