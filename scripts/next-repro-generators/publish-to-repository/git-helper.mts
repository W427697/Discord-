import { $ } from 'zx';

/**
 * Git add everything in the directory this method is called and commit all the files
 */
export async function commitEverythingInDirectory(commitMessage: string) {
  await $`git add .`;

  try {
    await $`git commit -m ${commitMessage}`;
  } catch (e) {
    console.log(`Nothing to commit 🤷`);
  }
}

/**
 * Init a Git repository with initial branch named with input string
 */
export async function initRepo(branch: string) {
  await $`git init --initial-branch ${branch}`;
}
