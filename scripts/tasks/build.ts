import { pathExists } from 'fs-extra';
import { join } from 'path';
import type { Task } from '../task';
import { exec } from '../utils/exec';

export const build: Task = {
  before: ['create'],
  async ready(_, { sandboxDir }) {
    return pathExists(join(sandboxDir, 'storybook-static'));
  },
  async run(_, { sandboxDir }) {
    return exec(`yarn build-storybook --quiet`, { cwd: sandboxDir });
  },
};
