import type { Options, StoriesEntry } from '@storybook/types';
import { normalizeStories, commonGlobOptions } from '@storybook/core-common';
import { isAbsolute, join, relative } from 'path';
import slash from 'slash';
import { glob } from 'glob';

export async function removeMDXEntries(
  entries: StoriesEntry[],
  options: Pick<Options, 'configDir'>
): Promise<ReturnType<typeof normalizeStories>[]> {
  const list = normalizeStories(entries, {
    configDir: options.configDir,
    workingDir: options.configDir,
    defaultFilesPattern: '**/*.@(stories.@(js|jsx|mjs|ts|tsx))',
  });
  const result = (
    await Promise.all(
      list.map(async ({ directory, files, titlePrefix }) => {
        const pattern = join(directory, files);
        const absolutePattern = isAbsolute(pattern) ? pattern : join(options.configDir, pattern);
        const absoluteDirectory = isAbsolute(directory)
          ? directory
          : join(options.configDir, directory);

        return {
          files: (
            await glob(slash(absolutePattern), {
              ...commonGlobOptions(absolutePattern),
              follow: true,
            })
          ).map((f) => relative(absoluteDirectory, f)),
          directory,
          titlePrefix,
        };
      })
    )
  ).flatMap<StoriesEntry>((expanded, i) => {
    const filteredEntries = expanded.files.filter((s) => !s.endsWith('.mdx'));
    // only return the filtered entries when there is something to filter
    // as webpack is faster with unexpanded globs
    let items = [];
    if (filteredEntries.length < expanded.files.length) {
      items = filteredEntries.map((k) => ({
        ...expanded,
        files: `**/${k}`,
      }));
    } else {
      items = [list[i]];
    }

    return items;
  });
  return result;
}
