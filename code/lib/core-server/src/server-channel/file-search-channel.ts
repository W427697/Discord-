import type { CoreConfig, Options, SupportedRenderers } from '@storybook/core/dist/types';
import type { Channel } from '@storybook/core/dist/channels';
import {
  extractProperRendererNameFromFramework,
  getFrameworkName,
  getProjectRoot,
} from '@storybook/core/dist/common';
import path from 'path';
import fs from 'fs/promises';

import { getParser } from '../utils/parser';
import { searchFiles } from '../utils/search-files';
import type {
  FileComponentSearchRequestPayload,
  FileComponentSearchResponsePayload,
  RequestData,
  ResponseData,
} from '@storybook/core/dist/core-events';
import {
  FILE_COMPONENT_SEARCH_REQUEST,
  FILE_COMPONENT_SEARCH_RESPONSE,
} from '@storybook/core/dist/core-events';
import { doesStoryFileExist, getStoryMetadata } from '../utils/get-new-story-file';
import { telemetry } from '@storybook/core/dist/telemetry';

export async function initFileSearchChannel(
  channel: Channel,
  options: Options,
  coreOptions: CoreConfig
) {
  /**
   * Listens for a search query event and searches for files in the project
   */
  channel.on(
    FILE_COMPONENT_SEARCH_REQUEST,
    async (data: RequestData<FileComponentSearchRequestPayload>) => {
      const searchQuery = data.id;
      try {
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
            const { storyFileName } = getStoryMetadata(path.join(projectRoot, file));
            const dirname = path.dirname(file);

            const storyFileExists = doesStoryFileExist(
              path.join(projectRoot, dirname),
              storyFileName
            );

            const info = await parser.parse(content);

            return {
              filepath: file,
              exportedComponents: info.exports,
              storyFileExists,
            };
          } catch (e) {
            if (!coreOptions.disableTelemetry) {
              telemetry('create-new-story-file-search', {
                success: false,
                error: `Could not parse file: ${e}`,
              });
            }

            return {
              filepath: file,
              storyFileExists: false,
              exportedComponents: null,
            };
          }
        });

        if (!coreOptions.disableTelemetry) {
          telemetry('create-new-story-file-search', {
            success: true,
            payload: {
              fileCount: entries.length,
            },
          });
        }

        channel.emit(FILE_COMPONENT_SEARCH_RESPONSE, {
          success: true,
          id: searchQuery,
          payload: {
            files: await Promise.all(entries),
          },
          error: null,
        } satisfies ResponseData<FileComponentSearchResponsePayload>);
      } catch (e: any) {
        /**
         * Emits the search result event with an error message
         */
        channel.emit(FILE_COMPONENT_SEARCH_RESPONSE, {
          success: false,
          id: searchQuery ?? '',
          error: `An error occurred while searching for components in the project.\n${e?.message}`,
        } satisfies ResponseData<FileComponentSearchResponsePayload>);

        if (!coreOptions.disableTelemetry) {
          telemetry('create-new-story-file-search', {
            success: false,
            error: `An error occured while searching for components: ${e}`,
          });
        }
      }
    }
  );

  return channel;
}
