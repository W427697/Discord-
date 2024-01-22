import type { Task } from '../task';
import { exec } from '../utils/exec';

export const installPlaywright: Task = {
  description: 'Install Playwright browsers',
  async ready() {
    return false;
  },
  async run(details, options) {
    await exec(
      'npx playwright@1.41.1 install --with-deps',
      { cwd: details.codeDir },
      { dryRun: options.dryRun, debug: options.debug }
    );
  },
};
