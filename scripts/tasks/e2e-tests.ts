import type { Task } from '../task';
import { exec } from '../utils/exec';
import { PORT } from './serve';

export const e2eTests: Task = {
  before: ['serve'],
  junit: true,
  async ready() {
    return false;
  },
  async run({ junitFilename, template }, { dryRun, debug }) {
    await exec(
      'yarn playwright test --reporter=junit',
      {
        env: {
          STORYBOOK_URL: `http://localhost:${PORT}`,
          STORYBOOK_TEMPLATE_NAME: template.name,
          ...(junitFilename && {
            PLAYWRIGHT_JUNIT_OUTPUT_NAME: junitFilename,
          }),
        },
      },
      { dryRun, debug }
    );
  },
};
