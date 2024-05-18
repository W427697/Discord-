import chalk from 'chalk';
import { dedent } from 'ts-dedent';
import { readConfig } from '@storybook/core/dist/csf-tools';
import type { Fix } from '../types';
import { detectPnp } from '../../detect';
import { updateMainConfig } from '../helpers/mainConfigFile';
import {
  getFieldsForRequireWrapper,
  getRequireWrapperAsCallExpression,
  getRequireWrapperName,
  isRequireWrapperNecessary,
  wrapValueWithRequireWrapper,
} from './wrap-require-utils';

interface WrapRequireRunOptions {
  storybookVersion: string;
  isStorybookInMonorepo: boolean;
  isPnp: boolean;
  isConfigTypescript: boolean;
}

export const wrapRequire: Fix<WrapRequireRunOptions> = {
  id: 'wrap-require',

  versionRange: ['<7.2.0-rc.0', '>=7.2.0-rc.0'],

  async check({ packageManager, storybookVersion, mainConfigPath }) {
    const isStorybookInMonorepo = await packageManager.isStorybookInMonorepo();
    const isPnp = await detectPnp();

    if (!mainConfigPath) {
      return null;
    }

    const config = await readConfig(mainConfigPath);

    if (!isStorybookInMonorepo && !isPnp) {
      return null;
    }

    if (!getFieldsForRequireWrapper(config).some((node) => isRequireWrapperNecessary(node))) {
      return null;
    }

    const isConfigTypescript = mainConfigPath.endsWith('.ts') || mainConfigPath.endsWith('.tsx');

    return { storybookVersion, isStorybookInMonorepo, isPnp, isConfigTypescript };
  },

  prompt({ storybookVersion, isStorybookInMonorepo }) {
    const sbFormatted = chalk.cyan(`Storybook ${storybookVersion}`);

    return dedent`We have detected that you're using ${sbFormatted} in a ${
      isStorybookInMonorepo ? 'monorepo' : 'PnP'
    } project. 
    For Storybook to work correctly, some fields in your main config must be updated. We can do this for you automatically.
    
    More info: https://storybook.js.org/docs/react/faq#how-do-i-fix-module-resolution-in-special-environments`;
  },

  async run({ dryRun, mainConfigPath, result }) {
    return new Promise((resolve, reject) => {
      updateMainConfig({ dryRun: !!dryRun, mainConfigPath }, (mainConfig) => {
        try {
          getFieldsForRequireWrapper(mainConfig).forEach((node) => {
            wrapValueWithRequireWrapper(mainConfig, node);
          });

          if (getRequireWrapperName(mainConfig) === null) {
            if (
              mainConfig?.fileName?.endsWith('.cjs') ||
              mainConfig?.fileName?.endsWith('.cts') ||
              mainConfig?.fileName?.endsWith('.cjsx') ||
              mainConfig?.fileName?.endsWith('.ctsx')
            ) {
              mainConfig.setRequireImport(['dirname', 'join'], 'path');
            } else {
              mainConfig.setImport(['dirname', 'join'], 'path');
            }
            mainConfig.setBodyDeclaration(
              getRequireWrapperAsCallExpression(result.isConfigTypescript)
            );
          }

          resolve();
        } catch (e) {
          reject(e);
        }
      });
    });
  },
};
