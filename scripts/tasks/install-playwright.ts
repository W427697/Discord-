import type { Task } from '../task';
import { CODE_DIRECTORY } from '../utils/constants';
import { exec } from '../utils/exec';

export const installPlaywright: Task = {
  description: 'Install Playwright browsers',
  async ready() {
    return false;
  },
  async run(details, options) {
    await exec(
      'npx playwright install --with-deps',
      { cwd: details.codeDir },
      { dryRun: options.dryRun, debug: options.debug }
    );
  },
};
