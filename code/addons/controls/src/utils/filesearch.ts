import { globby } from 'globby';
import path from 'path';
import fs from 'fs';

import type { SupportedRenderer } from './parser/types';
import { getParser } from './parser';
import { isNotNull } from './ts-utils';

export type SearchResult = Array<{
  filepath: string;
  exportedComponents: Array<{
    name: string;
    default: boolean;
  }>;
}>;

/**
 * Characters that are used in glob patterns to identify search queries that are not just filenames
 */
const globPatternChars = ['*', '+(', '@(', '?(', '!(', '[', ']'];

/**
 * Search for files in a directory that match the search query
 * @param searchQuery The search query. This can be a glob pattern
 * @param cwd The directory to search in
 * @param renderer The renderer to use for parsing the files
 * @returns A list of files that match the search query and has exports
 */
export async function searchFiles(
  searchQuery: string,
  cwd: string,
  renderer: SupportedRenderer
): Promise<SearchResult> {
  const hasGlobChars = globPatternChars.some((char) => searchQuery.includes(char));

  const globbedSearchQuery = hasGlobChars ? searchQuery : `**/${searchQuery}**`;

  const entries = await globby(globbedSearchQuery, {
    ignore: ['**/node_modules/**'],
    gitignore: true,
    cwd,
    objectMode: true,
  });

  const files = entries.map(async (entry) => {
    const parser = getParser(renderer);
    const content = fs.readFileSync(path.join(cwd, entry.path), 'utf-8');

    try {
      const info = await parser.parse(content);

      return {
        filepath: entry.path,
        exportedComponents: info.exports,
      };
    } catch (e) {
      return null;
    }
  });
  return (await Promise.all(files)).filter(isNotNull);
}
