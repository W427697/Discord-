import { dedent } from 'ts-dedent';
import { getAddonNames, updateMainConfig } from '../helpers/mainConfigFile';
import type { Fix } from '../types';
import { getStorybookVersionSpecifier } from '../../helpers';

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

    // @ts-expect-error (user might be upgrading from an older version that still had it)
    const usesMDX1 = mainConfig?.features?.legacyMdx1 === true || false;
    const skip = hadAddonInstalled;

    if (skip) {
      return null;
    }

    return {};
  },

  prompt() {
    return dedent`
      We've detected that you're not yet using the Visual Testing Addon. Would you like to add it?
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
