import { pathExists } from 'fs-extra';
import { join } from 'path';
import type { Task } from '../task';
import { exec } from '../utils/exec';

export const installRepo: Task = {
  async ready({ codeDir }) {
    return pathExists(join(codeDir, 'node_modules'));
  },
  async run({ codeDir }, { dryRun, debug }) {
    return exec(`yarn install`, { cwd: codeDir }, { dryRun, debug });
  },
};
