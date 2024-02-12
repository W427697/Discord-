import { createBlocker } from './types';
import { dedent } from 'ts-dedent';
import { lt } from 'semver';

export const blocker = createBlocker({
  id: 'minimumNode16',
  async check() {
    const nodeVersion = process.versions.node;
    if (lt(nodeVersion, '16.0.0')) {
      return { nodeVersion };
    }
    return false;
  },
  message(options, data) {
    return `Please use Node.js v16 or higher.`;
  },
  log(options, data) {
    return dedent`
      We've detected you're using Node.js v${data.nodeVersion}.
      Storybook needs at least Node.js 16.

      https://nodejs.org/en/download
    `;
  },
});
