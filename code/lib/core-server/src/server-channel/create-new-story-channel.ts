import type { Options } from '@storybook/types';
import type { Channel } from '@storybook/channels';
import type { CreateNewStoryPayload, CreateNewStoryResult } from '@storybook/core-events';
import {
  CREATE_NEW_STORYFILE_REQUEST,
  CREATE_NEW_STORYFILE_RESPONSE,
} from '@storybook/core-events';
import fs from 'node:fs/promises';
import { getNewStoryFile } from '../utils/get-new-story-file';
import { getStoryId } from '../utils/get-story-id';
import path from 'node:path';

export function initCreateNewStoryChannel(channel: Channel, options: Options) {
  /**
   * Listens for events to create a new storyfile
   */
  channel.on(CREATE_NEW_STORYFILE_REQUEST, async (data: CreateNewStoryPayload) => {
    try {
      const { storyFilePath, exportedStoryName, storyFileContent } = await getNewStoryFile(
        data,
        options
      );

      await fs.writeFile(storyFilePath, storyFileContent, 'utf-8');

      const storyId = await getStoryId({ storyFilePath, exportedStoryName }, options);

      channel.emit(CREATE_NEW_STORYFILE_RESPONSE, {
        success: true,
        result: {
          storyId,
          storyFilePath: `./${path.relative(process.cwd(), storyFilePath)}`,
          exportedStoryName,
        },
        error: null,
      } satisfies CreateNewStoryResult);
    } catch (e: any) {
      channel.emit(CREATE_NEW_STORYFILE_RESPONSE, {
        success: false,
        result: null,
        error: e?.message,
      } satisfies CreateNewStoryResult);
    }
  });

  return channel;
}
