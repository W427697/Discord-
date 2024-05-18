import type { CoreConfig, Options } from '@storybook/core/dist/types';
import type { Channel } from '@storybook/core/dist/channels';
import { telemetry } from '@storybook/core/dist/telemetry';
import type {
  CreateNewStoryErrorPayload,
  CreateNewStoryRequestPayload,
  CreateNewStoryResponsePayload,
  RequestData,
  ResponseData,
} from '@storybook/core/dist/core-events';
import {
  CREATE_NEW_STORYFILE_REQUEST,
  CREATE_NEW_STORYFILE_RESPONSE,
} from '@storybook/core/dist/core-events';
import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { getNewStoryFile } from '../utils/get-new-story-file';
import { getStoryId } from '../utils/get-story-id';
import path from 'node:path';

export function initCreateNewStoryChannel(
  channel: Channel,
  options: Options,
  coreOptions: CoreConfig
) {
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

        const { storyId, kind } = await getStoryId({ storyFilePath, exportedStoryName }, options);

        if (existsSync(storyFilePath)) {
          channel.emit(CREATE_NEW_STORYFILE_RESPONSE, {
            success: false,
            id: data.id,
            payload: {
              type: 'STORY_FILE_EXISTS',
              kind,
            },
            error: `A story file already exists at ${relativeStoryFilePath}`,
          } satisfies ResponseData<CreateNewStoryResponsePayload, CreateNewStoryErrorPayload>);

          if (!coreOptions.disableTelemetry) {
            telemetry('create-new-story-file', {
              success: false,
              error: 'STORY_FILE_EXISTS',
            });
          }

          return;
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

        if (!coreOptions.disableTelemetry) {
          telemetry('create-new-story-file', {
            success: true,
          });
        }
      } catch (e: any) {
        channel.emit(CREATE_NEW_STORYFILE_RESPONSE, {
          success: false,
          id: data.id,
          error: e?.message,
        } satisfies ResponseData<CreateNewStoryResponsePayload>);

        if (!coreOptions.disableTelemetry) {
          await telemetry('create-new-story-file', {
            success: false,
            error: e,
          });
        }
      }
    }
  );

  return channel;
}
