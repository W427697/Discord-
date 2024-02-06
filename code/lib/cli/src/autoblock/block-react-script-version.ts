import { createBlocker } from './types';
import { dedent } from 'ts-dedent';
import { gte } from 'semver';

export const blocker = createBlocker({
  id: 'storiesMdxUsage',
  async check({ packageManager }) {
    const version = await packageManager.getVersion('react-scripts');
    if (version && gte(version, '5.0.0')) {
      return false;
    }
    return { version };
  },
  message(options, data) {
    return `Found react-script version: ${data.version}, please upgrade to latest.`;
  },
  log() {
    return dedent`
      Support react-script < 5.0.0 has been removed.
      Please see the migration guide for more information:
      https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#create-react-app-dropped-cra4-support
      
      Upgrade to the latest version of react-scripts.
    `;
  },
});
