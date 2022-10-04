import type { Task } from '../task';
import { exec } from '../utils/exec';

export const smokeTest: Task = {
  before: ['create'],
  async ready() {
    return false;
  },
  async run(_, { sandboxDir }) {
    // eslint-disable-next-line no-console
    console.log(`smoke testing in ${sandboxDir}`);

    setInterval(() => console.log('outer script running'), 10000);

    return exec(
      `yarn storybook --smoke-test && echo done`,
      { cwd: sandboxDir, timeout: 60000 },
      { debug: true }
    );

    console.log(`smoke testing in ${sandboxDir} done`);
  },
};
