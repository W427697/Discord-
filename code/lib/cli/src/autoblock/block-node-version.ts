import { createBlocker } from './types';
import { dedent } from 'ts-dedent';
import { lt } from 'semver';

export const blocker = createBlocker({
  id: 'minimumNode16',
  async check() {
    const nodeVersion = process.version;
    if (lt(nodeVersion, '16.0.0')) {
      return { nodeVersion };
    }
    return false;
  },
  message(options, data) {
    return `Please use NodeJS v16 or higher.`;
  },
  log(options, data) {
    return dedent`
      We've detected you're using NodeJS v${data.nodeVersion}.
      Storybook needs at least NodeJS 16.

      https://nodejs.org/en/download
    `;
  },
});
