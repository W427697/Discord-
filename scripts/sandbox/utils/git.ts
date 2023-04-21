import fetch from 'node-fetch';
import { execaCommand } from '../../utils/exec';
// eslint-disable-next-line import/no-cycle
import { logger } from '../publish';

const getTheLastCommitHashThatUpdatedTheSandboxRepo = async (branch: string) => {
  const owner = 'storybookjs';
  const repo = 'sandboxes';

  try {
    const branchData = await (
      await fetch(`https://api.github.com/repos/${owner}/${repo}/branches/${branch}`)
    ).json();
    const latestCommitSha = branchData.commit.sha;
    const commitData = await (
      await fetch(`https://api.github.com/repos/${owner}/${repo}/commits/${latestCommitSha}`)
    ).json();
    const latestCommitMessage = commitData.commit.message;
    logger.log(
      `Latest commit message of ${owner}/${repo} on branch ${branch}: ${latestCommitMessage}`
    );
    // The commit message will look like this: Update examples - Thu Apr 13 2023 - 97dbc82537c3
    // the hash at the end relates to the monorepo commit that updated the sandboxes
    return latestCommitMessage.split('\n')[0].split(' - ')[2];
  } catch (error) {
    logger.error(
      `Error getting latest commit message of ${owner}/${repo} on branch ${branch}: ${error.message}`
    );

    throw error;
  }
};

/**
 * When commiting the changes to the sandboxes repo, we want to include the PRs that were merged since the last commit that updated the sandboxes.
 * This might help us debug issues or changes that affected the sandboxes at some point in time.
 */
export async function commitAllToGit({ cwd, branch }: { cwd: string; branch: string }) {
  try {
    logger.log(`💪 Committing everything to the repository`);

    await execaCommand('git add .', { cwd });

    const currentCommitHash = (await execaCommand('git rev-parse HEAD')).stdout
      .toString()
      .slice(0, 12);

    let gitCommitCommand;

    try {
      const previousCommitHash = await getTheLastCommitHashThatUpdatedTheSandboxRepo(branch);
      const mergeCommits = (
        await execaCommand(
          `git log ${previousCommitHash}..${currentCommitHash} --merges --pretty=%s`
        )
      ).stdout
        .toString()
        .split('\n')
        .filter((s: string) => s.includes('pull request'));

      const prLinks = mergeCommits.map((mergeCommit) => {
        const prNumber = mergeCommit.match(/Merge pull request #(\d+)/)[1];
        const branchName = mergeCommit.match(/from (.+)/)[1].replace('storybookjs/', '');
        return `- https://github.com/storybookjs/storybook/pull/${prNumber} (${branchName})`;
      });

      const diffLink = `https://github.com/storybookjs/storybook/compare/${previousCommitHash}...${currentCommitHash}`;

      const commitTitle = `Update sandboxes - ${new Date().toDateString()} - ${previousCommitHash}`;
      const commitBody = [...prLinks, `\nCheck the diff here: ${diffLink}`].join('\n');
      gitCommitCommand = `git commit -m "${commitTitle}" -m "${commitBody}"`;
    } catch (err) {
      gitCommitCommand = `git commit -m "Update sandboxes - ${new Date().toDateString()} - ${currentCommitHash}`;
    }

    await execaCommand(gitCommitCommand, {
      shell: true,
      cwd,
    });
  } catch (e) {
    logger.log(
      `🤷 Git found no changes between previous versions so there is nothing to commit. Skipping publish!`
    );
  }
}
