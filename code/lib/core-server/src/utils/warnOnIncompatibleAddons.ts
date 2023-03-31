import type { Preset } from '@storybook/types';
import { logger } from '@storybook/client-logger';
import chalk from 'chalk';
import dedent from 'ts-dedent';

export const warnOnIncompatibleAddons = (addons: Preset[]) => {
  const addonList = addons.map((addon) => {
    if (typeof addon === 'string') {
      return addon;
    }
    if (typeof addon === 'object') {
      return addon.name;
    }

    return undefined;
  });

  const addonNames = addonList.filter(Boolean);

  // TODO: Keep this up to date with https://github.com/storybookjs/storybook/issues/20529
  const incompatibleList = [
    '@storybook/addon-knobs',
    '@storybook/addon-postcss',
    'storybook-addon-next-router',
    'storybook-addon-outline',
    '@storybook/addon-info',
    'storybook-addon-next',
    'storybook-docs-toc',
    '@storybook/addon-google-analytics',
    'storybook-addon-pseudo-states',
    'storybook-dark-mode',
    'storybook-addon-gatsby',
    '@etchteam/storybook-addon-css-variables-theme',
    '@storybook/addon-cssresources',
    'storybook-addon-grid',
    'storybook-multilevel-sort',
    'storybook-addon-i18next',
    'storybook-source-link',
    'babel-plugin-storybook-csf-title',
    '@urql/storybook-addon',
    'storybook-addon-intl',
    'storybook-addon-mock',
    '@chakra-ui/storybook-addon',
    'storybook-mobile-addon',
  ];

  const incompatibleAddons = addonNames.filter((addon) => incompatibleList.includes(addon));

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
