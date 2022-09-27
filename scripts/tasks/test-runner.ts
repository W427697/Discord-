import type { Task } from '../task';
import { exec } from '../utils/exec';
import { PORT } from './serve';

export const testRunner: Task = {
  junit: true,
  before: ['run-registry-repo', 'build'],
  async ready() {
    return false;
  },
  async run({ sandboxDir, junitFilename }, { dryRun, debug }) {
    const execOptions = { cwd: sandboxDir };

    await exec(`yarn add --dev @storybook/test-runner@0.7.1-next.0`, execOptions);

    await exec(
      `yarn test-storybook --url http://localhost:${PORT} --junit`,
      {
        ...execOptions,
        env: {
          JEST_JUNIT_OUTPUT_FILE: junitFilename,
        },
      },
      { dryRun, debug }
    );
  },
};
