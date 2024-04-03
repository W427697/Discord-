import type { Options, SupportedRenderers } from '@storybook/types';
import type { Channel } from '@storybook/channels';
import { FILE_COMPONENT_SEARCH, FILE_COMPONENT_SEARCH_RESULT } from '../constants';
import { searchFiles } from '../utils/filesearch';
import {
  extractProperRendererNameFromFramework,
  getFrameworkName,
  getProjectRoot,
} from '@storybook/core-common';
import dedent from 'ts-dedent';
import assert from 'node:assert';

interface Data {
  // A regular string or a glob pattern
  searchQuery?: string;
}

interface SearchResult {
  success: true | false;
  result: null | {
    searchQuery: string;
    files: Array<{
      // The filepath relative to the project root
      filepath: string;
      // The search query - Helps to identify the event on the frontend
      searchQuery: string;
      // A list of exported components
      exportedComponents: Array<{
        // the name of the exported component
        name: string;
        // True, if the exported component is a default export
        default: boolean;
      }>;
    }> | null;
  };
  error: null | string;
}

export function initFileSearchChannel(channel: Channel, options: Options) {
  /**
   * Listenes for a search query event and searches for files in the project
   */
  channel.on(FILE_COMPONENT_SEARCH, async (data: Data) => {
    try {
      const searchQuery = data?.searchQuery;

      assert(searchQuery, 'searchQuery is required');

      const frameworkName = await getFrameworkName(options);

      const rendererName = (await extractProperRendererNameFromFramework(
        frameworkName
      )) as SupportedRenderers;

      const projectRoot = getProjectRoot();

      const files = await searchFiles(searchQuery, projectRoot, rendererName);

      /**
       * Emits the search result event with the search result
       */
      channel.emit(FILE_COMPONENT_SEARCH_RESULT, {
        success: true,
        result: {
          searchQuery,
          files,
        },
        error: null,
      } as SearchResult);
    } catch (e: any) {
      /**
       * Emits the search result event with an error message
       */
      channel.emit(FILE_COMPONENT_SEARCH_RESULT, {
        success: false,
        result: null,
        error: dedent`
          An error occurred while searching for components in the project.
          ${e?.message}
        `,
      } as SearchResult);
    }
  });

  return channel;
}
