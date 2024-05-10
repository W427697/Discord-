import { dedent } from 'ts-dedent';
import chalk from 'chalk';
import type { DocsOptions } from '@storybook/types';
import { readConfig, writeConfig } from '@storybook/csf-tools';
import { updateMainConfig } from '../helpers/mainConfigFile';
import type { Fix } from '../types';

const logger = console;

interface Options {
  autodocs: DocsOptions['autodocs'];
  previewConfigPath?: string;
}

/**
 */
export const autodocsTags: Fix<Options> = {
  id: 'autodocs-tags',
  versionRange: ['*.*.*', '>=8.0.*'],
  async check({ mainConfig, previewConfigPath }) {
    const autodocs = mainConfig?.docs?.autodocs;
    if (autodocs === undefined) return null;

    if (autodocs === true && !previewConfigPath) {
      throw Error(dedent`
        ❌ Failed to remove the deprecated ${chalk.cyan('docs.autodocs')} setting from ${chalk.cyan(
          '.storybook/main.js'
        )}.
        
        There is no preview config file to add the ${chalk.cyan('autodocs')} tag to.

        Please perform the migration by hand: ${chalk.yellow(
          'github.com/storybookjs/storybook/blob/next/MIGRATION.md#mainjs-docsautodocs-is-deprecated'
        )}
      `);
      return null;
    }

    return { autodocs, previewConfigPath };
  },

  prompt({ autodocs, previewConfigPath }) {
    let falseMessage = '',
      trueMessage = '';

    if (autodocs === false) {
      falseMessage = dedent`


        There is no ${chalk.cyan('docs.autodocs = false')} equivalent.
        You'll need to check your stories to ensure none are tagged with ${chalk.cyan('autodocs')}.
      `;
    } else if (autodocs === true) {
      trueMessage = ` and update ${chalk.cyan(previewConfigPath)}`;
    }

    return dedent`
      The ${chalk.cyan('docs.autodocs')} setting in ${chalk.cyan(
        '.storybook/main.js'
      )} is deprecated.${falseMessage}
        
      Learn more: ${chalk.yellow(
        'github.com/storybookjs/storybook/blob/next/MIGRATION.md#mainjs-docsautodocs-is-deprecated'
      )}
      
      Remove ${chalk.cyan('docs.autodocs')}${trueMessage}?
    `;
  },

  async run({ dryRun, mainConfigPath, result }) {
    if (!dryRun) {
      if (result.autodocs === true) {
        logger.info(`✅ Adding "autodocs" tag to ${result.previewConfigPath}`);
        const previewConfig = await readConfig(result.previewConfigPath!);
        const tags = previewConfig.getFieldNode(['tags']);
        if (tags) {
          previewConfig.appendValueToArray(['tags'], 'autodocs');
        } else {
          previewConfig.setFieldValue(['tags'], ['autodocs']);
        }
        await writeConfig(previewConfig);
      }

      await updateMainConfig({ mainConfigPath, dryRun: !!dryRun }, async (main) => {
        logger.info(`✅ Removing "docs.autodocs" from ${mainConfigPath}`);
        main.removeField(['docs', 'autodocs']);
      });
    }
  },
};
