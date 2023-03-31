import chalk from 'chalk';
import dedent from 'ts-dedent';
import type { Fix } from '../types';
import { getStorybookData, getIncompatibleAddons } from '../helpers/mainConfigFile';

interface IncompatibleAddonsOptions {
  incompatibleAddonList: string[];
}

export const incompatibleAddons: Fix<IncompatibleAddonsOptions> = {
  id: 'incompatible-addons',
  promptOnly: true,

  async check({ packageManager, configDir }) {
    const { mainConfig } = await getStorybookData({
      packageManager,
      configDir,
    });

    const incompatibleAddonList = getIncompatibleAddons(mainConfig);

    return incompatibleAddonList.length > 0 ? { incompatibleAddonList } : null;
  },
  prompt({ incompatibleAddonList }) {
    return dedent`
      ${chalk.bold(
        chalk.red('Attention')
      )}: We've detected that you're using the following addons which are known to be incompatible with Storybook 7:

      ${incompatibleAddonList.map((addon) => `- ${chalk.cyan(addon)}`).join('\n')}

      Please upgrade at your own risk, and check the following Github issue for more information:
      ${chalk.yellow('https://github.com/storybookjs/storybook/issues/20529')}
    `;
  },
};
