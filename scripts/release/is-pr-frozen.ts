/* eslint-disable no-continue */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
import chalk from 'chalk';
import program from 'commander';
import { simpleGit } from 'simple-git';
import { setOutput } from '@actions/core';
import { getPullInfoFromCommit } from './get-github-info';

program
  .name('is-pr-frozen')
  .description('returns true if the pull reques associated with the branch has the "freeze" label')
  .arguments('<branch>')
  .option('-V, --verbose', 'Enable verbose logging', false);

const git = simpleGit();

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
  const repo = pushUrl.replace(/\.git$/, '').replace(/.*:/, '');
  if (verbose) {
    console.log(`📦 Extracted repo: ${chalk.blue(repo)}`);
  }
  return repo;
};

export const run = async (args: unknown[], options: unknown) => {
  const { verbose } = options as { verbose?: boolean };
  const branch = args[0] as string;

  console.log(`💬 Determining if pull request from branch '${chalk.blue(branch)}' is frozen`);

  console.log(`⬇️ Fetching remote 'origin/${branch}'...`);
  try {
    await git.fetch('origin', branch);
  } catch (error) {
    console.warn(
      `❗ Could not fetch remote 'origin/${branch}', it probably does not exist yet, which is okay`
    );
    console.warn(error);
    console.log(`💧 Pull request doesn't exist yet! 😎`);
    if (process.env.GITHUB_ACTIONS === 'true') {
      setOutput('frozen', false);
    }
    return false;
  }

  const commit = await git.revparse(`origin/${branch}`);
  console.log(`🔍 Found commit: ${commit}`);

  const repo = await getRepo(verbose);

  const pullRequest = await getPullInfoFromCommit({ repo, commit }).catch((err) => {
    console.error(`🚨 Could not get pull requests from commit: ${commit}`);
    console.error(err);
    throw err;
  });
  console.log(`🔍 Found pull request:
  ${JSON.stringify(pullRequest, null, 2)}`);

  const isFrozen = pullRequest.labels?.includes('freeze');
  if (process.env.GITHUB_ACTIONS === 'true') {
    setOutput('frozen', isFrozen);
  }
  if (isFrozen) {
    console.log(`🧊 Pull request is frozen! 🥶`);
  } else {
    console.log(`🔥 Pull request is on fire! 🥵`);
  }
  return isFrozen;
};

if (require.main === module) {
  const parsed = program.parse();
  run(parsed.args, parsed.opts()).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
