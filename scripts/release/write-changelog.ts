/* eslint-disable no-continue */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
import chalk from 'chalk';
import path from 'path';
import program from 'commander';
import semver from 'semver';
import type { DefaultLogFields, ListLogLine } from 'simple-git';
import { simpleGit } from 'simple-git';
import { z } from 'zod';
import { readFile, writeFile } from 'fs-extra';
import type { PullRequestInfo } from './get-github-info';
import { getPullInfoFromCommit } from './get-github-info';

program
  .name('write-changelog')
  .description(
    'write changelog based on merged PRs and commits. the <version> argument describes which version to generate for, must be a semver string'
  )
  .arguments('<version>')
  .option('-P, --patches-only', 'Set to only consider PRs labeled with "patch" label')
  .option(
    '-F, --from <tag>',
    'Which tag or commit to generate changelog from, eg. "7.0.7". Leave unspecified to select latest released tag in git history'
  )
  .option(
    '-T, --to <tag>',
    'Which tag or commit to generate changelog to, eg. "7.1.0-beta.8". Leave unspecified to select HEAD commit'
  )
  .option('-D, --dry-run', 'Do not write file, only output to shell', false)
  .option('-V, --verbose', 'Enable verbose logging', false);

const optionsSchema = z.object({
  patchesOnly: z.boolean().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  verbose: z.boolean().optional(),
  dryRun: z.boolean().optional(),
});

type Options = {
  patchesOnly?: boolean;
  from?: string;
  to?: string;
  verbose: boolean;
  dryRun?: boolean;
};

const git = simpleGit();

const LABELS_FOR_CHANGELOG = [
  'BREAKING CHANGE',
  'feature request',
  'bug',
  'documentation',
  'maintenance',
];

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

const getCommitAt = async (id: string, verbose?: boolean) => {
  if (!semver.valid(id)) {
    console.log(`🔍 ${chalk.red(id)} is not a valid semver string, assuming it is a commit hash`);
    return id;
  }
  const version = id.startsWith('v') ? id : `v${id}`;
  const commitSha = (await git.raw(['rev-list', '-n', '1', version])).split('\n')[0];
  if (verbose) {
    console.log(`🔍 Commit at tag ${chalk.green(version)}: ${chalk.blue(commitSha)}`);
  }
  return commitSha;
};

const getFromCommit = async (from?: string | undefined, verbose?: boolean) => {
  let actualFrom = from;
  if (!from) {
    console.log(`🔍 No 'from' specified, finding latest version tag, fetching all of them...`);
    await git.fetch('origin', ['--all', '--tags']);
    const { latest } = await git.tags(['v*', '--sort=-v:refname', '--merged']);
    actualFrom = latest;
    if (verbose) {
      console.log(`🔍 No 'from' specified, found latest tag: ${chalk.blue(latest)}`);
    }
  }
  const commit = await getCommitAt(actualFrom, verbose);
  if (verbose) {
    console.log(`🔍 Found 'from' commit: ${chalk.blue(commit)}`);
  }
  return commit;
};

const getToCommit = async (to?: string | undefined, verbose?: boolean) => {
  if (!to) {
    const head = await git.revparse('HEAD');
    if (verbose) {
      console.log(`🔍 No 'to' specified, HEAD is at commit: ${chalk.blue(head)}`);
    }
    return head;
  }

  const commit = await getCommitAt(to, verbose);
  if (verbose) {
    console.log(`🔍 Found 'to' commit: ${chalk.blue(commit)}`);
  }
  return commit;
};

const getAllCommitsBetween = async ({
  from,
  to,
  verbose,
}: {
  from: string;
  to?: string;
  verbose?: boolean;
}) => {
  const logResult = await git.log({ from, to });
  if (verbose) {
    console.log(
      `🔍 Found ${chalk.blue(logResult.total)} commits between ${chalk.green(
        `${from}`
      )} and ${chalk.green(`${to}`)}:`
    );
    console.dir(logResult.all, { depth: null, colors: true });
  }
  return logResult.all;
};

const getRepo = async (verbose?: boolean): Promise<string> => {
  const remotes = await git.getRemotes(true);
  const originRemote = remotes.find((remote) => remote.name === 'origin');
  if (!originRemote) {
    console.error(
      'Could not determine repository URL because no remote named "origin" was found. Remotes found:'
    );
    console.dir(remotes, { depth: null, colors: true });
    throw new Error('No remote named "origin" found');
  }
  const pushUrl = originRemote.refs.push;
  const repo = pushUrl.replace(/\.git$/, '').replace(/.*:(\/\/github\.com\/)*/, '');
  if (verbose) {
    console.log(`📦 Extracted repo: ${chalk.blue(repo)}`);
  }
  return repo;
};

const getPullInfoFromCommits = async ({
  repo,
  commits,
  verbose,
}: {
  repo: string;
  commits: readonly { hash: string }[];
  verbose?: boolean;
}): Promise<PullRequestInfo[]> => {
  const pullRequests = await Promise.all(
    commits.map((commit) =>
      getPullInfoFromCommit({
        repo,
        commit: commit.hash,
      })
    )
  );
  if (verbose) {
    console.log(`🔍 Found pull requests:`);
    console.dir(pullRequests, { depth: null, colors: true });
  }
  return pullRequests;
};

type ChangelogEntry = PullRequestInfo;

const getChangelogEntries = ({
  commits,
  pullRequests,
  patchesOnly,
  verbose,
}: {
  commits: readonly (DefaultLogFields & ListLogLine)[];
  pullRequests: PullRequestInfo[];
  patchesOnly?: boolean;
  verbose?: boolean;
}): ChangelogEntry[] => {
  if (pullRequests.length !== commits.length) {
    // not all commits are associated with a pull request, but the pullRequests array should still contain those commits
    console.error('Pull requests and commits are not the same length, this should not happen');
    console.error(`Pull Requests: ${pullRequests.length}`);
    console.dir(pullRequests, { depth: null, colors: true });
    console.error(`Commits: ${commits.length}`);
    console.dir(commits, { depth: null, colors: true });
    throw new Error('Pull requests and commits are not the same length, this should not happen');
  }
  const allEntries = pullRequests.map((pr, index) => {
    return {
      ...pr,
      title: pr.title || commits[index].message,
    };
  });

  const changelogEntries: ChangelogEntry[] = [];
  allEntries.forEach((entry) => {
    // filter out any duplicate entries, eg. when multiple commits are associated with the same pull request
    if (
      entry.pull &&
      changelogEntries.findIndex((existing) => entry.pull === existing.pull) !== -1
    ) {
      return;
    }
    // filter out any entries that are not patches if patchesOnly is set. this will also filter out direct commits
    if (patchesOnly && !entry.labels?.includes('patch')) {
      return;
    }
    changelogEntries.push(entry);
  });

  if (verbose) {
    console.log(`📝 Generated changelog entries:`);
    console.dir(changelogEntries, { depth: null, colors: true });
  }
  return changelogEntries;
};

const getChangelogText = ({
  changelogEntries,
  version,
}: {
  changelogEntries: ChangelogEntry[];
  version: string;
}): string => {
  const heading = `## ${version}`;
  const formattedEntries = changelogEntries
    .filter((entry) => {
      // don't include direct commits that are not from pull requests
      if (!entry.pull) {
        return false;
      }
      // only include PRs that with labels listed in LABELS_FOR_CHANGELOG
      return entry.labels?.some((label) => LABELS_FOR_CHANGELOG.includes(label));
    })
    .map((entry) => {
      const { title, links } = entry;
      const { pull, commit, user } = links;
      return pull
        ? `- ${title} - ${pull}, thanks ${user}!`
        : `- ⚠️ _Direct commit_ ${title} - ${commit} by ${user}`;
    });
  const text = [heading, '', ...formattedEntries].join('\n');

  console.log(`✅ Generated Changelog:`);
  console.log(text);

  return text;
};

const writeToFile = async ({
  changelogText,
  version,
  verbose,
}: {
  changelogText: string;
  version: string;
  verbose?: boolean;
}) => {
  const isPrerelease = semver.prerelease(version) !== null;
  const changelogFilename = isPrerelease ? 'CHANGELOG.prerelease.md' : 'CHANGELOG.md';
  const changelogPath = path.join(__dirname, '..', '..', changelogFilename);

  if (verbose) {
    console.log(`📝 Writing changelog to ${chalk.blue(changelogPath)}`);
  }

  const currentChangelog = await readFile(changelogPath, 'utf-8');
  const nextChangelog = [changelogText, currentChangelog].join('\n\n');

  await writeFile(changelogPath, nextChangelog);
};

export const run = async (args: unknown[], options: unknown) => {
  if (!validateOptions(args, options)) {
    return;
  }
  const { from, to, patchesOnly, dryRun, verbose } = options;
  const version = args[0] as string;

  console.log(
    `💬 Generating changelog for ${chalk.blue(version)} between ${chalk.green(
      from || 'latest'
    )} and ${chalk.green(to || 'HEAD')}`
  );

  const fromCommit = await getFromCommit(from, verbose);
  const toCommit = await getToCommit(to, verbose);

  // get commit at latest version tag
  const commits = await getAllCommitsBetween({ from: fromCommit, to: toCommit, verbose });
  const repo = await getRepo(verbose);
  const pullRequests = await getPullInfoFromCommits({ repo, commits, verbose }).catch((err) => {
    console.error(
      `🚨 Could not get pull requests from commits, this is usually because you have unpushed commits`
    );
    console.error(err);
    throw err;
  });
  const changelogEntries = getChangelogEntries({ commits, pullRequests, patchesOnly, verbose });
  const changelogText = getChangelogText({
    changelogEntries,
    version,
  });

  if (dryRun) {
    console.log(`📝 Dry run, not writing file`);
    return;
  }

  await writeToFile({ changelogText, version, verbose });

  console.log(`✅ Wrote Changelog to file`);
};

if (require.main === module) {
  const parsed = program.parse();
  run(parsed.args, parsed.opts()).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
