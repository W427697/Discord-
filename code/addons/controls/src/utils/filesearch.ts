import { globby } from 'globby';
import type { SupportedRenderer } from './parser';
import { getParser } from './parser';

export interface Data {
  searchQuery: string;
}

export interface SearchResult {
  success: boolean;
  files: null | Array<{
    filepath: string;
    searchQuery: string;
    exportedComponents: Array<{
      name: string;
      default: boolean;
    }>;
  }>;
  error: null | string;
}

export async function searchFiles(
  data: Data,
  cwd: string,
  renderer: SupportedRenderer
): Promise<SearchResult> {
  try {
    const entries = await globby(data.searchQuery, {
      ignore: ['**/node_modules/**'],
      gitignore: true,
      cwd,
      objectMode: true,
    });

    const files = entries.map(async (entry) => {
      const parser = getParser(renderer);
      const info = await parser.parse(entry.path);

      return {
        filepath: entry.path,
        searchQuery: data.searchQuery,
        exportedComponents: info.exports,
      };
    });

    return {
      success: true,
      files: await Promise.all(files),
      error: null,
    };
  } catch (e) {
    return {
      success: false,
      files: null,
      error: 'An error occurred while searching for files',
    };
  }
}
