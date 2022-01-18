import { $ } from "zx";

/**
 * Git add everything in the directory this method is called and commit all the files
 *
 * @param {string} commitMessage
 * @return {Promise<void>}
 */
export async function commitEverythingInDirectory(commitMessage) {
  await $`git add .`;

  try {
    await $`git commit -m ${commitMessage}`;
  } catch (e) {
    console.log(`Nothing to commit 🤷`);
  }
}

/**
 * Check if there are some changes in the local Git repository
 *
 * @return {Promise<boolean>}
 */
export async function hasLocalChanges() {
  return (await $`git status --porcelain`).toString() !== '';
}
