/* eslint-disable no-await-in-loop */
import prompts from 'prompts';
import chalk from 'chalk';
import boxen from 'boxen';
import { JsPackageManagerFactory, type PackageManagerName } from '../js-package-manager';

import type { Fix } from './fixes';
import { fixes } from './fixes';
import dedent from 'ts-dedent';

const logger = console;

type FixId = string;

interface FixOptions {
  fixId?: FixId;
  yes?: boolean;
  dryRun?: boolean;
  useNpm?: boolean;
  force?: PackageManagerName;
}

enum FixStatus {
  CHECK_FAILED = 'check_failed',
  UNNECESSARY = 'unnecessary',
  SKIPPED = 'skipped',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
}

export const automigrate = async ({ fixId, dryRun, yes, useNpm, force }: FixOptions = {}) => {
  const packageManager = JsPackageManagerFactory.getPackageManager({ useNpm, force });
  const filtered = fixId ? fixes.filter((f) => f.id === fixId) : fixes;

  logger.info('🔎 checking possible migrations..');
  const fixResults = {} as Record<FixId, FixStatus>;
  const fixSummary = { succeeded: [], failed: {} } as { succeeded: FixId[], failed: Record<FixId, string>};

  for (let i = 0; i < filtered.length; i += 1) {
    const f = fixes[i] as Fix;
    let result;
    let fixStatus = FixStatus.UNNECESSARY;
    
    try {
      result = await f.check({ packageManager });
    } catch (error) {
      logger.info(`⚠️  failed to check fix ${chalk.bold(f.id)}`);
      fixStatus = FixStatus.CHECK_FAILED;
      fixSummary.failed[f.id] = error.message;
    }

    if (result) {
      logger.info(`\n🔎 found a '${chalk.cyan(f.id)}' migration:`);
      const message = f.prompt(result);

      logger.info(
        boxen(message, { borderStyle: 'round', padding: 1, borderColor: '#F1618C' })
      );

      let runAnswer: { fix: boolean };

      if (dryRun) {
        runAnswer = { fix: false };
      } else if (yes) {
        runAnswer = { fix: true };
      } else {
        runAnswer = await prompts({
          type: 'confirm',
          name: 'fix',
          message: `Do you want to run the '${chalk.cyan(f.id)}' migration on your project?`,
          initial: true,
        });
      }

      if (runAnswer.fix) {
        try {
          await f.run({ result, packageManager, dryRun });
          logger.info(`✅ ran ${chalk.cyan(f.id)} migration`);
          fixStatus = FixStatus.SUCCEEDED;
          fixSummary.succeeded.push(f.id);
        } catch (error) {
          fixStatus = FixStatus.FAILED;
          fixSummary.failed[f.id] = error.message;
          logger.info(`❌ error when running ${chalk.cyan(f.id)} migration:`);
          logger.info(error);
          logger.info();
        }
      } else {
        fixStatus = FixStatus.SKIPPED;
        logger.info(`Skipping the ${chalk.cyan(f.id)} migration.`);
        logger.info();
        logger.info(
          `If you change your mind, run '${chalk.cyan('npx storybook@next automigrate')}'`
        );
      }
    }

    fixResults[f.id] = fixStatus
  }

  logger.info()
  logger.info(getMigrationSummary(fixResults, fixSummary));
  logger.info()

  return fixResults;
};

function getMigrationSummary(fixResults: Record<string, FixStatus>, fixSummary: { succeeded: FixId[]; failed: Record<FixId, string>; }) {
  const hasNoFixes = Object.values(fixResults).every((r) => r === FixStatus.UNNECESSARY);
  const hasFailures = Object.values(fixResults).some((r) => r === FixStatus.FAILED || r === FixStatus.CHECK_FAILED);
  let title = hasNoFixes ? 'No migrations were applicable to your project' : hasFailures ? 'Migration check ran with failures' : 'Migration check ran successfully';

  let successfulFixesMessage = fixSummary.succeeded.length > 0
    ? `
      ${chalk.bold('Migrations that succeeded:')}\n\n ${fixSummary.succeeded.map(m => chalk.green(m)).join(', ')}
    `
    : '';

  let failedFixesMessage = Object.keys(fixSummary.failed).length > 0
    ? `
    ${chalk.bold('Migrations that failed:')}\n ${Object.entries(fixSummary.failed).reduce((acc, [id, error]) => {
      return acc + `\n${chalk.redBright(id)}:\n${error}`;
    }, '')}
    \n`
    : '';

  const divider = hasNoFixes ? '' : '\n─────────────────────────────────────────────────\n\n';

  let summaryMessage = dedent`
    ${successfulFixesMessage}${failedFixesMessage}${divider}If you'd like to run the migrations again, you can do so by running '${chalk.cyan('npx storybook@next automigrate')}'
    
    The automigrations try to migrate common patterns in your project, but might not contain everything needed to migrate to the latest version of Storybook.
    
    Please check the changelog and migration guide for manual migrations and more information: ${chalk.yellow('https://storybook.js.org/migration-guides/7.0')}
    And reach out on Discord if you need help: ${chalk.yellow('https://discord.gg/storybook')}
  `;

  return boxen(summaryMessage, { borderStyle: 'round', padding: 1, title, borderColor: hasFailures ? 'red' : 'green' });
}

