import { dedent } from 'ts-dedent';
import { getAddonNames, updateMainConfig } from '../helpers/mainConfigFile';
import type { Fix } from '../types';

const logger = console;

interface Options {}

/**
 */
export const vta: Fix<Options> = {
  id: 'visual-testing-addon',

  versionRange: ['<8.0.7', '>=8.0.7'],

  async check({ mainConfig }) {
    const hadAddonInstalled = !!getAddonNames(mainConfig).find((addon) =>
      addon.includes('@chromatic-com/storybook')
    );

    const skip = hadAddonInstalled;

    if (skip) {
      return null;
    }

    return {};
  },

  prompt() {
    return dedent`
      New to Storybook 8: Storybook's Visual Tests addon helps you catch unintentional changes/bugs in your stories. The addon is powered by Chromatic, a cloud-based testing tool developed by Storybook's core team.

      Learn more: storybook.js.org/docs/writing-tests/visual-testing
      
      Install Visual Tests addon in your project?
    `;
  },

  async run({ packageManager, dryRun, mainConfigPath, skipInstall }) {
    if (!dryRun) {
      const packageJson = await packageManager.retrievePackageJson();
      await packageManager.addDependencies(
        { installAsDevDependencies: true, skipInstall, packageJson },
        [`@chromatic-com/storybook@^1`]
      );

      await updateMainConfig({ mainConfigPath, dryRun: !!dryRun }, async (main) => {
        logger.info(`✅ Adding "@chromatic-com/storybook" addon`);
        if (!dryRun) {
          main.appendValueToArray(['addons'], '@chromatic-dom/storybook');
        }
      });
    }
  },
};
