import { ensureDir, pathExists, writeJSON } from 'fs-extra';
import { join } from 'path';
import type { Task } from '../task';
import { exec } from '../utils/exec';

const now = () => new Date().getTime();

export const build: Task = {
  description: 'Build the static version of the sandbox',
  dependsOn: ['sandbox'],
  async ready({ builtSandboxDir }) {
    return pathExists(builtSandboxDir);
  },
  async run({ sandboxDir }, { dryRun, debug }) {
    const start = now();
    const result = await exec(
      `yarn build-storybook --quiet`,
      { cwd: sandboxDir },
      { dryRun, debug }
    );
    const time = now() - start;
    await ensureDir(join(sandboxDir, 'bench'));
    await writeJSON(join(sandboxDir, 'bench', 'build.json'), { time }, { spaces: 2 });
    return result;
  },
};
