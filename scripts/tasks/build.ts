import { pathExists } from 'fs-extra';
import { join } from 'path';
import type { Task } from '../task';
import { exec } from '../utils/exec';
import { now, saveBench } from '../bench';

export const build: Task = {
  description: 'Build the static version of the sandbox',
  dependsOn: ['sandbox'],
  async ready({ builtSandboxDir }) {
    return pathExists(builtSandboxDir);
  },
  async run({ sandboxDir, codeDir }, { dryRun, debug }) {
    const start = now();
    const result = await exec(
      `yarn build-storybook --quiet`,
      { cwd: sandboxDir },
      { dryRun, debug }
    );

    const time = now() - start;
    await saveBench({ time }, { key: 'build', rootDir: codeDir });

    return result;
  },
};
