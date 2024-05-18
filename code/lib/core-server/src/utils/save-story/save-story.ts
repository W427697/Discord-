/* eslint-disable no-underscore-dangle */
import fs from 'node:fs/promises';
import type { Channel } from '@storybook/core/dist/channels';
import type {
  RequestData,
  ResponseData,
  SaveStoryRequestPayload,
  SaveStoryResponsePayload,
} from '@storybook/core/dist/core-events';
import {
  SAVE_STORY_REQUEST,
  SAVE_STORY_RESPONSE,
  STORY_RENDERED,
} from '@storybook/core/dist/core-events';
import { storyNameFromExport, toId } from '@storybook/csf';
import { printCsf, readCsf } from '@storybook/core/dist/csf-tools';
import { logger } from '@storybook/core/dist/node-logger';
import type { CoreConfig, Options } from '@storybook/core/dist/types';
import { telemetry } from '@storybook/core/dist/telemetry';

import { basename, join } from 'path';
import { updateArgsInCsfFile } from './update-args-in-csf-file';
import { duplicateStoryWithNewName } from './duplicate-story-with-new-name';
import { formatFileContent } from '@storybook/core/dist/common';
import { SaveStoryError } from './utils';

const parseArgs = (args: string): Record<string, any> =>
  JSON.parse(args, (_, value) => {
    if (value === '__sb_empty_function_arg__') {
      return () => {};
    }
    return value;
  });

// Removes extra newlines between story properties. See https://github.com/benjamn/recast/issues/242
// Only updates the part of the code for the story with the given name.
const removeExtraNewlines = (code: string, name: string) => {
  const anything = '(.|\r\n|\r|\n)'; // Multiline match for any character.
  const newline = '(\r\n|\r|\n)'; // Either newlines or carriage returns may be used in the file.
  const closing = newline + '};' + newline; // Marks the end of the story definition.
  const regex = new RegExp(
    // Looks for an export by the given name, considers the first closing brace on its own line
    // to be the end of the story definition.
    `^(?<before>${anything}*)(?<story>export const ${name} =${anything}+?${closing})(?<after>${anything}*)$`
  );
  const { before, story, after } = code.match(regex)?.groups || {};
  return story
    ? before + story.replaceAll(/(\r\n|\r|\n)(\r\n|\r|\n)([ \t]*[a-z0-9_]+): /gi, '$2$3:') + after
    : code;
};

export function initializeSaveStory(channel: Channel, options: Options, coreConfig: CoreConfig) {
  channel.on(SAVE_STORY_REQUEST, async ({ id, payload }: RequestData<SaveStoryRequestPayload>) => {
    const { csfId, importPath, args, name } = payload;

    let newStoryId: string | undefined;
    let newStoryName: string | undefined;
    let sourceFileName: string | undefined;
    let sourceFilePath: string | undefined;
    let sourceStoryName: string | undefined;

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
        args ? parseArgs(args) : {}
      );

      const code = await formatFileContent(
        sourceFilePath,
        removeExtraNewlines(printCsf(csf).code, name || storyName)
      );

      // Writing the CSF file should trigger HMR, which causes the story to rerender. Delay the
      // response until that happens, but don't wait too long.
      await Promise.all([
        new Promise<void>((resolve) => {
          channel.on(STORY_RENDERED, resolve);
          setTimeout(() => resolve(channel.off(STORY_RENDERED, resolve)), 3000);
        }),
        fs.writeFile(sourceFilePath, code),
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
        error: null,
      } satisfies ResponseData<SaveStoryResponsePayload>);

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
        error: error instanceof SaveStoryError ? error.message : 'Unknown error',
      } satisfies ResponseData<SaveStoryResponsePayload>);

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
