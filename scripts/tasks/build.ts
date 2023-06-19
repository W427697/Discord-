import { pathExists } from 'fs-extra';
import type { Task } from '../task';
import { exec } from '../utils/exec';
import { now, saveBench } from '../bench/utils';

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

    await saveBench({ time }, { key: 'build', rootDir: sandboxDir });

    return result;
  },
};
