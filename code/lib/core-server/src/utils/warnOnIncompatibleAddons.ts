import type { StorybookConfig } from '@storybook/types';
import { logger } from '@storybook/client-logger';
import chalk from 'chalk';
import dedent from 'ts-dedent';

import { getIncompatibleAddons } from '../../../cli/src/automigrate/helpers/getIncompatibleAddons';

export const warnOnIncompatibleAddons = async (config: StorybookConfig) => {
  const incompatibleAddons = await getIncompatibleAddons(config);

  if (incompatibleAddons.length > 0) {
    logger.warn(dedent`
      ${chalk.bold(
        chalk.red('Attention')
      )}: We've detected that you're using the following addons which are known to be incompatible with Storybook 7:

      ${incompatibleAddons.map((addon) => `- ${chalk.cyan(addon)}`).join('\n')}

      Please upgrade at your own risk, and check the following Github issue for more information:
      ${chalk.yellow('https://github.com/storybookjs/storybook/issues/20529')}\n
    `);
  }
};
