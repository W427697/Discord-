/* eslint-disable no-continue */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
import chalk from 'chalk';
import program from 'commander';
import semver from 'semver';
import { z } from 'zod';
import dedent from 'ts-dedent';
import { setOutput } from '@actions/core';
import type { Change } from './utils/get-changes';
import { getChanges } from './utils/get-changes';

program
  .name('generate-pr-description')
  .description('generate a PR description for a release')
  .requiredOption(
    '-C, --current-version <version>',
    'Which version to generate changelog from, eg. "7.0.7"'
  )
  .requiredOption(
    '-N, --next-version <version>',
    'Which version to generate changelog to, eg. "7.0.8"'
  )
  .option('-P, --patches-only', 'Set to only consider PRs labeled with "patch" label')
  .option('-V, --verbose', 'Enable verbose logging', false);

const optionsSchema = z.object({
  currentVersion: z.string(),
  nextVersion: z.string(),
  patchesOnly: z.boolean().optional(),
  verbose: z.boolean().optional(),
});

type Options = {
  currentVersion: string;
  nextVersion: string;
  patchesOnly?: boolean;
  verbose: boolean;
};

const validateOptions = (options: { [key: string]: any }): options is Options => {
  optionsSchema.parse(options);
  return true;
};

const LABELS_BY_IMPORTANCE = {
  'BREAKING CHANGE': '❗ Breaking Change',
  'feature request': '✨ Feature Request',
  bug: '🐛 Bug',
  maintenance: '🔧 Maintenance',
  documentation: '📝 Documentation',
  build: '🏗️ Build',
  unknown: '⚠️ Missing Label',
} as const;

export const mapToTodoItems = (changes: Change[]): string => {
  return changes
    .map((change) => {
      if (!change.pull) {
        return `- **⚠️ Direct commit**: ${change.title} ${change.links.commit}
\t- [ ] The change is appropriate for the version bump`;
      }
      const label = (change.labels
        ?.filter((l) => Object.keys(LABELS_BY_IMPORTANCE).includes(l))
        .sort(
          (a, b) =>
            Object.keys(LABELS_BY_IMPORTANCE).indexOf(a) -
            Object.keys(LABELS_BY_IMPORTANCE).indexOf(b)
        )[0] || 'unknown') as keyof typeof LABELS_BY_IMPORTANCE;

      return `- **${LABELS_BY_IMPORTANCE[label]}**: ${change.title} ${change.links.pull}
\t- [ ] The change is appropriate for the version bump
\t- [ ] The PR is labeled correctly
\t- [ ] The PR title is correct`;
    })
    .join('\n');
};

export const generateReleaseDescription = ({
  currentVersion,
  nextVersion,
  todoItems,
  changelogText,
}: {
  currentVersion: string;
  nextVersion: string;
  todoItems: string;
  changelogText: string;
}): string => {
  // don't mention contributors in the release PR, to avoid spamming them
  const unmentionChangelog = changelogText.replaceAll('[@', '[@ ');

  return dedent`This is an automated pull request that bumps the version from \`${currentVersion}\` to \`${nextVersion}\`.
  Once this pull request is merged, it will trigger a new release of version \`${nextVersion}\`.
  If you're not a core maintainer with permissions to release you can ignore this pull request.

  ## To do

  Before merging the PR, there are a few QA steps to go through:

  - [ ] Add the "freeze" label to this PR, to ensure it doesn't get automatically forced pushed by new changes.
  
  And for each change below:
  
  1. Ensure the change is appropriate for the version bump. E.g. patch release should only contain patches, not new or de-stabilizing features. If a change is not appropriate, revert the PR.
  2. Ensure the PR is labeled correctly with "BREAKING CHANGE", "feature request", "maintainance", "bug", "build" or "documentation".
  3. Ensure the PR title is correct, and follows the format "[Area]: [Summary]", e.g. *"React: Fix hooks in CSF3 render functions"*. If it is not correct, change the title in the PR.
      - Areas include: React, Vue, Core, Docs, Controls, etc.
      - First word of summary indicates the type: “Add”, “Fix”, “Upgrade”, etc.
      - The entire title should fit on a line
  
  This is a list of all the PRs merged and commits pushed directly to \`next\`, that will be part of this release:
  
  ${todoItems}

  If you needed to make any changes doing the above QA (change PR titles, revert PRs), manually trigger a re-generation of this PR with [this workflow](https://github.com/storybookjs/monorepo-release-tooling-prototype/actions/workflows/prepare-prerelease.yml) and wait for it to finish. It will wipe your progress in this to do, which is expected.
  
  When everything above is done:
  - [ ] Merge this PR
  - [ ] [Approve the publish workflow run](https://github.com/storybookjs/monorepo-release-tooling-prototype/actions/workflows/publish.yml)
  
  ---
  
  # Generated changelog
  
  ${unmentionChangelog}`;
};

export const run = async (options: unknown) => {
  if (!validateOptions(options)) {
    return;
  }
  const { currentVersion, nextVersion, patchesOnly, verbose } = options;

  console.log(
    `💬 Generating PR description for ${chalk.blue(nextVersion)} between ${chalk.green(
      currentVersion
    )} and ${chalk.green('HEAD')}`
  );

  const { changes, changelogText } = await getChanges({
    version: nextVersion,
    from: `v${currentVersion}`,
    to: 'HEAD',
    patchesOnly,
    verbose,
  });
  // TODO: determine if a release is needed or not

  const todoItems = mapToTodoItems(changes);

  const description = generateReleaseDescription({
    currentVersion,
    nextVersion,
    todoItems,
    changelogText,
  });

  if (process.env.GITHUB_ACTIONS === 'true') {
    setOutput('description', description);
  }
  console.log(`✅ Generated PR description for ${chalk.blue(nextVersion)}`);
  if (verbose) {
    console.log(description);
  }
};

if (require.main === module) {
  const parsed = program.parse();
  run(parsed.opts()).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
