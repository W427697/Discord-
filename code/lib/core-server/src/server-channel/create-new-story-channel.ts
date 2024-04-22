import type { Options } from '@storybook/types';
import type { Channel } from '@storybook/channels';
import type {
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

        if (existsSync(storyFilePath)) {
          throw new Error(`Story file already exists at ${relativeStoryFilePath}`);
        }

        await fs.writeFile(storyFilePath, storyFileContent, 'utf-8');

        const storyId = await getStoryId({ storyFilePath, exportedStoryName }, options);

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
          payload: null,
          error: e?.message,
        } satisfies ResponseData<CreateNewStoryResponsePayload>);
      }
    }
  );

  return channel;
}
