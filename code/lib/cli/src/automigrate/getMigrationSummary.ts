import chalk from 'chalk';
import boxen from 'boxen';
import dedent from 'ts-dedent';

export type FixId = string;

export enum FixStatus {
  CHECK_FAILED = 'check_failed',
  UNNECESSARY = 'unnecessary',
  SKIPPED = 'skipped',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
}

export function getMigrationSummary(
  fixResults: Record<string, FixStatus>,
  fixSummary: { succeeded: FixId[]; failed: Record<FixId, string> }
) {
  const hasNoFixes = Object.values(fixResults).every((r) => r === FixStatus.UNNECESSARY);
  const hasFailures = Object.values(fixResults).some(
    (r) => r === FixStatus.FAILED || r === FixStatus.CHECK_FAILED
  );
  // eslint-disable-next-line no-nested-ternary
  const title = hasNoFixes
    ? 'No migrations were applicable to your project'
    : hasFailures
    ? 'Migration check ran with failures'
    : 'Migration check ran successfully';

  const successfulFixesMessage =
    fixSummary.succeeded.length > 0
      ? `
      ${chalk.bold('Migrations that succeeded:')}\n\n ${fixSummary.succeeded
          .map((m) => chalk.green(m))
          .join(', ')}
    `
      : '';

  const failedFixesMessage =
    Object.keys(fixSummary.failed).length > 0
      ? `
    ${chalk.bold('Migrations that failed:')}\n ${Object.entries(fixSummary.failed).reduce(
          (acc, [id, error]) => {
            return `${acc}\n${chalk.redBright(id)}:\n${error}\n`;
          },
          ''
        )}
    \n`
      : '';

  const divider = hasNoFixes ? '' : '\n─────────────────────────────────────────────────\n\n';

  const summaryMessage = dedent`
    ${successfulFixesMessage}${failedFixesMessage}${divider}If you'd like to run the migrations again, you can do so by running '${chalk.cyan(
    'npx storybook@next automigrate'
  )}'
    
    The automigrations try to migrate common patterns in your project, but might not contain everything needed to migrate to the latest version of Storybook.
    
    Please check the changelog and migration guide for manual migrations and more information: ${chalk.yellow(
      'https://storybook.js.org/migration-guides/7.0'
    )}
    And reach out on Discord if you need help: ${chalk.yellow('https://discord.gg/storybook')}
  `;

  return boxen(summaryMessage, {
    borderStyle: 'round',
    padding: 1,
    title,
    borderColor: hasFailures ? 'red' : 'green',
  });
}
