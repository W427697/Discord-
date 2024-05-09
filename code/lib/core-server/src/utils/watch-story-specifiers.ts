import slash from 'slash';
import path from 'path';
import watcher from '@parcel/watcher';

import type { NormalizedStoriesSpecifier, Path } from '@storybook/types';

export async function watchStorySpecifiers(
  specifiers: NormalizedStoriesSpecifier[],
  { workingDir }: { workingDir: Path },
  onInvalidate: (specifier: NormalizedStoriesSpecifier, path: Path, removed: boolean) => void,
  onError?: (err: Error) => void
) {
  // Get absolute paths to all directories we want to watch, and condense them
  // down so that we're not creating multiple watches for the same directory.
  const directories = condenseDirectoryList(
    specifiers.map((ns) => slash(path.join(workingDir, ns.directory)))
  );

  const toImportPath = (absolutePath: Path) => {
    const relativePath = path.relative(workingDir, absolutePath);
    return slash(relativePath.startsWith('.') ? relativePath : `./${relativePath}`);
  };

  const watchDirectory = (directory: Path) => {
    return watcher.subscribe(
      directory,
      (err, events) => {
        if (err) {
          if (onError) {
            onError(err);
          }
          return;
        }
        for (const event of events) {
          const importPath = toImportPath(event.path);
          const matchingSpecifier = specifiers.find((ns) => ns.importPathMatcher.exec(importPath));
          if (matchingSpecifier) {
            onInvalidate(matchingSpecifier, importPath, event.type === 'delete');
          }
        }
      },
      {
        // TODO: Double check these ignore rules work as expected.
        ignore: ['**/.git', '**/node_modules'],
      }
    );
  };

  const subscriptions = await Promise.all(directories.map(watchDirectory));
  return () => {
    return Promise.all(subscriptions.map((s) => s.unsubscribe())).then(() => {});
  };
}

// Takes a list of unix-style absolute paths to directories (with no trailing
// slashes) and removes duplicates plus any children of other directories in the
// list.
export function condenseDirectoryList(directories: Path[]): Path[] {
  directories.sort((a, b) => a.length - b.length);
  const filtered: Path[] = [];
  for (const d of directories) {
    if (!filtered.some((prefix) => d === prefix || d.startsWith(`${prefix}/`))) {
      filtered.push(d);
    }
  }
  return filtered;
}
