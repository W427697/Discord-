import slash from 'slash';
import { dedent } from 'ts-dedent';
import { once } from '@storybook/client-logger';
import type { NormalizedStoriesSpecifier } from '@storybook/types';

// FIXME: types duplicated type from `core-common', to be
// removed when we remove v6 back-compat.

const stripExtension = (parts: string[]) => {
  const last = parts[parts.length - 1]?.replace(/(?:[.](?:story|stories))?([.][^.]+)$/i, '');
  return last ? [...parts.slice(0, -1), last] : parts;
};

// deal with files like "atoms/button/{button,index}.stories.js"
const removeRedundantFilename = (parts: string[]) => {
  const last = parts[parts.length - 1];
  const nextToLast = parts[parts.length - 2];
  return last && (last === nextToLast || /^(?:index|story|stories)$/i.test(last))
    ? parts.slice(0, -1)
    : parts;
};

/**
 * Combines path parts together, without duplicating separators (slashes).  Used instead of `path.join`
 * because this code runs in the browser.
 *
 * @param paths array of paths to join together.
 * @returns joined path string, with single '/' between parts
 */
function pathJoin(paths: string[]): string {
  return paths
    .flatMap((p) => p.split('/'))
    .filter(Boolean)
    .join('/');
}

export const userOrAutoTitleFromSpecifier = (
  fileName: string | number,
  entry: NormalizedStoriesSpecifier,
  userTitle?: string
) => {
  const { directory, importPathMatcher, titlePrefix = '' } = entry || {};
  // On Windows, backslashes are used in paths, which can cause problems here
  // slash makes sure we always handle paths with unix-style forward slash

  if (typeof fileName === 'number') {
    once.warn(dedent`
      CSF Auto-title received a numeric fileName. This typically happens when
      webpack is mis-configured in production mode. To force webpack to produce
      filenames, set optimization.moduleIds = "named" in your webpack config.
    `);
  }

  const normalizedFileName = slash(String(fileName));

  if (importPathMatcher.exec(normalizedFileName)) {
    if (!userTitle) {
      const suffix = normalizedFileName.replace(directory, '');
      let parts = pathJoin([titlePrefix, suffix]).split('/');
      parts = stripExtension(parts);
      parts = removeRedundantFilename(parts);
      return parts.join('/');
    }

    if (!titlePrefix) {
      return userTitle;
    }

    return pathJoin([titlePrefix, userTitle]);
  }

  return undefined;
};

export const userOrAutoTitle = (
  fileName: string,
  storiesEntries: NormalizedStoriesSpecifier[],
  userTitle?: string
) => {
  for (let i = 0; i < storiesEntries.length; i += 1) {
    const title = userOrAutoTitleFromSpecifier(fileName, storiesEntries[i], userTitle);
    if (title) return title;
  }

  return userTitle || undefined;
};
