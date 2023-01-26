import path from 'path';
import findUp from 'find-up';

// Try and figure out what the root folder of the project is.  This is used to generate some configuration.
export const getProjectRoot = (): string => {
  // Allow manual override in cases where the auto-detect doesn't work
  if (process.env.STORYBOOK_PROJECT_ROOT) {
    return process.env.STORYBOOK_PROJECT_ROOT;
  }
  // Assume the innermost git/svn/hg folder is the project root
  const foundVcsMetaDir = ['.git', '.svn', '.hg']
    .map((dir) => findUp.sync(dir, { type: 'directory' }))
    .filter(Boolean)[0];
  if (foundVcsMetaDir) {
    return path.join(foundVcsMetaDir, '..');
  }

  // Walk upwards out of any node_modules or .yarn folders.  We have ot keep going up multiple steps
  // because node_modules is commonly nested instead other node_modules or inside the .yarn cache folder
  let projectRoot = process.cwd();
  for (;;) {
    const cwd = projectRoot;
    const foundNodeModulesDir = ['node_modules', '.yarn']
      .map((dir) => findUp.sync(dir, { cwd, type: 'directory' }))
      .filter(Boolean)[0];
    if (foundNodeModulesDir) {
      projectRoot = path.join(foundNodeModulesDir, '..');
    } else {
      break;
    }
  }
  return projectRoot;
};

export const nodePathsToArray = (nodePath: string) =>
  nodePath
    .split(process.platform === 'win32' ? ';' : ':')
    .filter(Boolean)
    .map((p) => path.resolve('./', p));

const relativePattern = /^\.{1,2}([/\\]|$)/;
/**
 * Ensures that a path starts with `./` or `../`, or is entirely `.` or `..`
 */
export function normalizeStoryPath(filename: string) {
  if (relativePattern.test(filename)) return filename;

  return `.${path.sep}${filename}`;
}
