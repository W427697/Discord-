/* eslint-disable no-underscore-dangle */
import type { Channel } from '@storybook/channels';
import type { SaveStoryRequest, SaveStoryResponse } from '@storybook/core-events';
import { SAVE_STORY_REQUEST, SAVE_STORY_RESPONSE, STORY_RENDERED } from '@storybook/core-events';
import { storyNameFromExport, toId } from '@storybook/csf';
import { readCsf, writeCsf } from '@storybook/csf-tools';

import { basename, join } from 'path';
import { updateArgsInCsfFile } from './update-args-in-csf-file';
import { duplicateStoryWithNewName } from './duplicate-story-with-new-name';
import type { CoreConfig, Options } from '@storybook/types';
import { telemetry } from '@storybook/telemetry';
import { logger } from '@storybook/node-logger';

class SaveStoryError extends Error {}

export function initializeSaveStory(channel: Channel, options: Options, coreConfig: CoreConfig) {
  channel.on(SAVE_STORY_REQUEST, async ({ id, payload }: SaveStoryRequest) => {
    const { csfId, importPath, args, name } = payload;

    let newStoryId;
    let newStoryName;
    let sourceFileName;
    let sourceFilePath;
    let sourceStoryName;

    try {
      sourceFileName = basename(importPath);
      sourceFilePath = join(process.cwd(), importPath);

      const csf = await readCsf(sourceFilePath, {
        makeTitle: (userTitle: string) => userTitle || 'myTitle',
      });

      const parsed = csf.parse();
      const stories = Object.entries(parsed._stories);

      const [componentId, storyId] = csfId.split('--');
      newStoryName = name && storyNameFromExport(name);
      newStoryId = newStoryName && toId(componentId, newStoryName);

      const [storyName] = stories.find(([key, value]) => value.id.endsWith(`--${storyId}`)) || [];
      if (!storyName) {
        throw new SaveStoryError(`Source story not found.`);
      }
      if (name && csf.getStoryExport(name)) {
        throw new SaveStoryError(`Story already exists.`);
      }

      sourceStoryName = storyNameFromExport(storyName);

      await updateArgsInCsfFile(
        name ? duplicateStoryWithNewName(parsed, storyName, name) : csf.getStoryExport(storyName),
        args
      );

      // Writing the CSF file should trigger HMR, which causes the story to rerender. Delay the
      // response until that happens, but don't wait too long.
      await Promise.all([
        new Promise<void>((resolve) => {
          channel.on(STORY_RENDERED, resolve);
          setTimeout(() => resolve(channel.off(STORY_RENDERED, resolve)), 3000);
        }),
        writeCsf(csf, sourceFilePath),
      ]);

      channel.emit(SAVE_STORY_RESPONSE, {
        id,
        success: true,
        payload: {
          csfId,
          newStoryId,
          newStoryName,
          sourceFileName,
          sourceStoryName,
        },
      } satisfies SaveStoryResponse);

      if (!coreConfig.disableTelemetry) {
        await telemetry('save-story', {
          action: name ? 'createStory' : 'updateStory',
          success: true,
        });
      }
    } catch (error: any) {
      channel.emit(SAVE_STORY_RESPONSE, {
        id,
        success: false,
        error: error.message,
        payload: {
          csfId,
          newStoryId,
          newStoryName,
          sourceFileName,
          sourceStoryName,
        },
      } satisfies SaveStoryResponse);

      logger.error(
        `Error writing to ${sourceFilePath}:\n${error.stack || error.message || error.toString()}`
      );

      if (!coreConfig.disableTelemetry && !(error instanceof SaveStoryError)) {
        await telemetry('save-story', {
          action: name ? 'createStory' : 'updateStory',
          success: false,
          error,
        });
      }
    }
  });
}
