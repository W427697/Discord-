import type { Options, SupportedRenderers } from '@storybook/types';
import type { Channel } from '@storybook/channels';
import {
  extractProperRendererNameFromFramework,
  getFrameworkName,
  getProjectRoot,
} from '@storybook/core-common';
import path from 'path';
import fs from 'fs/promises';

import { getParser } from '../utils/parser';
import { searchFiles } from '../utils/search-files';
import type { FileComponentSearchPayload, FileComponentSearchResult } from '@storybook/core-events';
import {
  FILE_COMPONENT_SEARCH_REQUEST,
  FILE_COMPONENT_SEARCH_RESPONSE,
} from '@storybook/core-events';

export function initFileSearchChannel(channel: Channel, options: Options) {
  /**
   * Listens for a search query event and searches for files in the project
   */
  channel.on(FILE_COMPONENT_SEARCH_REQUEST, async (data: FileComponentSearchPayload) => {
    try {
      const searchQuery = data?.searchQuery;

      if (!searchQuery) {
        return;
      }

      const frameworkName = await getFrameworkName(options);

      const rendererName = (await extractProperRendererNameFromFramework(
        frameworkName
      )) as SupportedRenderers;

      const projectRoot = getProjectRoot();

      const files = await searchFiles({
        searchQuery,
        cwd: projectRoot,
      });

      const entries = files.map(async (file) => {
        const parser = getParser(rendererName);

        try {
          const content = await fs.readFile(path.join(projectRoot, file), 'utf-8');
          const info = await parser.parse(content);

          return {
            filepath: file,
            exportedComponents: info.exports,
          };
        } catch (e) {
          return {
            filepath: file,
            exportedComponents: null,
          };
        }
      });

      channel.emit(FILE_COMPONENT_SEARCH_RESPONSE, {
        success: true,
        result: {
          searchQuery,
          files: await Promise.all(entries),
        },
        error: null,
      } as FileComponentSearchResult);
    } catch (e: any) {
      /**
       * Emits the search result event with an error message
       */
      channel.emit(FILE_COMPONENT_SEARCH_RESPONSE, {
        success: false,
        result: null,
        error: `An error occurred while searching for components in the project.\n${e?.message}`,
      } as FileComponentSearchResult);
    }
  });

  return channel;
}
