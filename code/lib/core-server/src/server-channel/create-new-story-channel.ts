import type { Options } from '@storybook/types';
import type { Channel } from '@storybook/channels';
import type {
  CreateNewStoryErrorPayload,
  CreateNewStoryRequestPayload,
  CreateNewStoryResponsePayload,
  RequestData,
  ResponseData,
} from '@storybook/core-events';
import {
  CREATE_NEW_STORYFILE_REQUEST,
  CREATE_NEW_STORYFILE_RESPONSE,
} from '@storybook/core-events';
import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { getNewStoryFile } from '../utils/get-new-story-file';
import { getStoryId } from '../utils/get-story-id';
import path from 'node:path';

export function initCreateNewStoryChannel(channel: Channel, options: Options) {
  /**
   * Listens for events to create a new storyfile
   */
  channel.on(
    CREATE_NEW_STORYFILE_REQUEST,
    async (data: RequestData<CreateNewStoryRequestPayload>) => {
      try {
        const { storyFilePath, exportedStoryName, storyFileContent } = await getNewStoryFile(
          data.payload,
          options
        );

        const relativeStoryFilePath = path.relative(process.cwd(), storyFilePath);

        const storyId = await getStoryId({ storyFilePath, exportedStoryName }, options);

        if (existsSync(storyFilePath)) {
          channel.emit(CREATE_NEW_STORYFILE_RESPONSE, {
            success: false,
            id: data.id,
            payload: {
              type: 'STORY_FILE_EXISTS',
              storyId: storyId,
            },
            error: `A story file already exists at ${relativeStoryFilePath}`,
          } satisfies ResponseData<CreateNewStoryResponsePayload, CreateNewStoryErrorPayload>);
        }

        await fs.writeFile(storyFilePath, storyFileContent, 'utf-8');

        channel.emit(CREATE_NEW_STORYFILE_RESPONSE, {
          success: true,
          id: data.id,
          payload: {
            storyId,
            storyFilePath: path.relative(process.cwd(), storyFilePath),
            exportedStoryName,
          },
          error: null,
        } satisfies ResponseData<CreateNewStoryResponsePayload>);
      } catch (e: any) {
        channel.emit(CREATE_NEW_STORYFILE_RESPONSE, {
          success: false,
          id: data.id,
          error: e?.message,
        } satisfies ResponseData<CreateNewStoryResponsePayload>);
      }
    }
  );

  return channel;
}
