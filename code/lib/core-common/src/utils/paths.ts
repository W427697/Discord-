import path from 'path';
import findUp from 'find-up';

// Try and figure out what the root folder of the project is.  This is used to generate some configuration.
export const getProjectRoot = (): string => {
  // Allow manual override in cases where auto-detect doesn't work
  if (process.env.STORYBOOK_PROJECT_ROOT) {
    return process.env.STORYBOOK_PROJECT_ROOT;
  }

  // Check if the working directory or a parent contains a folder that is normally only in a project root
  const dirnames = ['.git', '.svn', '.hg', '.yarn'];
  for (let i = 0; i < dirnames.length; i += 1) {
    const name = dirnames[i];
    const foundDir = findUp.sync(name, { type: 'directory' });
    if (foundDir) {
      return path.join(foundDir, '..');
    }
  }

  // If a folder containing this file is named .yarn or node_modules, assume the containing folder is the project root
  const split = __dirname.split(/[/\\](.yarn|node_modules)/);
  if (split.length > 1) {
    return split[0];
  }

  // If none of the above yield a result, just go with the current working directory
  return process.cwd();
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
