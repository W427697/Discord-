/* eslint-disable no-continue */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
import chalk from 'chalk';
import program from 'commander';
import semver from 'semver';
import { z } from 'zod';
import { getChanges } from './utils/get-changes';

program
  .name('generate-pr-description')
  .description('generate a PR description for a release')
  .arguments('<version>')
  .option('-P, --patches-only', 'Set to only consider PRs labeled with "patch" label')
  .option(
    '-F, --from <tag>',
    'Which tag or commit to get changes from, eg. "7.0.7". Leave unspecified to select latest released tag in git history'
  )
  .option(
    '-T, --to <tag>',
    'Which tag or commit to get changes to, eg. "7.1.0-beta.8". Leave unspecified to select HEAD commit'
  )
  .option('-V, --verbose', 'Enable verbose logging', false);

const optionsSchema = z.object({
  patchesOnly: z.boolean().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  verbose: z.boolean().optional(),
});

type Options = {
  patchesOnly?: boolean;
  from?: string;
  to?: string;
  verbose: boolean;
};

const validateOptions = (args: unknown[], options: { [key: string]: any }): options is Options => {
  optionsSchema.parse(options);
  if (args.length !== 1 || !semver.valid(args[0] as string)) {
    console.error(
      `🚨 Invalid arguments, expected a single argument with the version to generate changelog for, eg. ${chalk.green(
        '7.1.0-beta.8'
      )}`
    );
    return false;
  }
  return true;
};

export const run = async (args: unknown[], options: unknown) => {
  if (!validateOptions(args, options)) {
    return;
  }
  const { from, to, patchesOnly, verbose } = options;
  const version = args[0] as string;

  console.log(
    `💬 Generating PR description for ${chalk.blue(version)} between ${chalk.green(
      from || 'latest'
    )} and ${chalk.green(to || 'HEAD')}`
  );

  const { changes, changelogText } = await getChanges({ version, from, to, patchesOnly, verbose });

  console.log(`✅ Generated PR description for ${chalk.blue(version)} below:`);
};

if (require.main === module) {
  const parsed = program.parse();
  run(parsed.args, parsed.opts()).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

// determine if a release is needed or not

// if not, generate PR description with all changes and exit

// if yes:
// get changelog
// generate description
