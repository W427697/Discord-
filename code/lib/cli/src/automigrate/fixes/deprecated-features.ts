import chalk from 'chalk';
import { dedent } from 'ts-dedent';

import type { Fix } from '../types';
import { getStorybookData, updateMainConfig } from '../helpers/mainConfigFile';

const logger = console;

interface DeprecatedFeaturesRunOptions {
  featuresToRemove: string[];
  featuresToWarn: string[];
  featureCount: number;
}

const REMOVED_FEATURES = [
  'postcss',
  'previewCsfV3',
  'breakingChangesV7',
  'argTypeTargetsV7',
  'warnOnLegacyHierarchySeparator',
  'interactionsDebugger',
];

const DEPRECATED_FEATURES = ['storyStoreV7', 'buildStoriesJson'];

/**
 * Detect and remove unnecessary features from main.js
 */
export const deprecatedFeatures: Fix<DeprecatedFeaturesRunOptions> = {
  id: 'deprecated-features',

  async check({ packageManager, configDir }) {
    const { mainConfig } = await getStorybookData({ packageManager, configDir });

    const { features } = mainConfig;

    const featuresToRemove = Object.keys(features).filter((feature) =>
      REMOVED_FEATURES.includes(feature)
    );

    const featuresToWarn = Object.keys(features).filter((feature) =>
      DEPRECATED_FEATURES.includes(feature)
    );

    if (featuresToRemove.length === 0 && featuresToWarn.length === 0) {
      return null;
    }

    return {
      featuresToRemove,
      featuresToWarn,
      featureCount: Object.keys(features).length,
    };
  },

  prompt({ featuresToRemove, featuresToWarn }) {
    const removalOfFeatures = '';

    return dedent`
      FILL ME

      More info: ${chalk.yellow(
        'https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#autodocs-changes'
      )}
    `;
  },

  async run({ result: { featuresToRemove, featureCount }, dryRun, mainConfigPath }) {
    logger.info(`✅ Removing unnecessary features in main.js`);
    if (!dryRun) {
      await updateMainConfig({ mainConfigPath, dryRun }, async (main) => {
        if (featureCount === featuresToRemove.length) {
          main.removeField(['features']);
        } else {
          featuresToRemove.forEach((feature) => {
            main.removeField(['features', feature]);
          });
        }
      });
    }
  },
};
