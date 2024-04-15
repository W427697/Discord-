/* eslint-disable no-underscore-dangle */
import type { Channel } from '@storybook/channels';
import { SAVE_STORY_REQUEST, SAVE_STORY_RESULT } from '@storybook/core-events';
import { storyNameFromExport, toId } from '@storybook/csf';
import { readCsf, writeCsf } from '@storybook/csf-tools';
import type { CoreConfig } from '@storybook/types';

import type { OptionsWithRequiredCache } from '../whats-new';
import { basename, join } from 'path';
import { updateArgsInCsfFile } from './update-args-in-csf-file';
import { duplicateStoryWithNewName } from './duplicate-story-with-new-name';
// import { sendTelemetryError } from '../withTelemetry';

interface RequestSaveStoryPayload {
  // The id of the request. It might be simply the story Title
  id: string;
  // The path of the Story
  importPath: string;
  // The updated list of set args
  args: Record<string, any>;
  // The exported name of the Story -> This information doesn't exist in the index.json yet.
  name?: string;
}

type RequestSaveStoryResultPayload = (
  | { id: string; success: true }
  | { id: string; success: false; errorMessage: string }
) & {
  newStoryId?: string;
  newStoryName?: string;
  sourceFileName?: string;
  sourceStoryName?: string;
};

export function initializeSaveFromControls(
  channel: Channel,
  options: OptionsWithRequiredCache,
  coreOptions: CoreConfig
) {
  channel.on(
    SAVE_STORY_REQUEST,
    async ({ id, importPath, args, name }: RequestSaveStoryPayload) => {
      let newStoryId;
      let newStoryName;
      let sourceFileName;
      let sourceFilePath;
      let sourceStoryName;

      try {
        sourceFileName = basename(importPath);
        sourceFilePath = join(process.cwd(), importPath);

        // open the story file
        const csf = await readCsf(sourceFilePath, {
          makeTitle: (userTitle: string) => userTitle || 'myTitle',
        });

        const parsed = csf.parse();
        const stories = Object.entries(parsed._stories);

        const [componentId, storyId] = id.split('--');
        newStoryName = name && storyNameFromExport(name);
        newStoryId = newStoryName && toId(componentId, newStoryName);

        // find the export_name for the id
        const [storyName] = stories.find(([key, value]) => value.id.endsWith(`--${storyId}`)) || [];
        if (!storyName) throw new Error(`Source story not found.`);
        if (name && csf.getStoryExport(name)) throw new Error(`Story already exists.`);

        sourceStoryName = storyNameFromExport(storyName);

        const node = name
          ? duplicateStoryWithNewName(parsed, storyName, name)
          : csf.getStoryExport(storyName);

        // modify the AST node with the new args
        updateArgsInCsfFile(node, args);

        // save the file
        await writeCsf(csf, sourceFilePath);

        channel.emit(SAVE_STORY_RESULT, {
          id,
          success: true,
          newStoryId,
          newStoryName,
          sourceFileName,
          sourceStoryName,
        } satisfies RequestSaveStoryResultPayload);
      } catch (e: any) {
        // sendTelemetryError(channel, e);
        channel.emit(SAVE_STORY_RESULT, {
          id,
          success: false,
          errorMessage: e.message,
          newStoryId,
          newStoryName,
          sourceFileName,
          sourceStoryName,
        } satisfies RequestSaveStoryResultPayload);

        console.error(`Error writing to ${sourceFilePath}:`, e.stack || e.message || e.toString());
      }
    }
  );
}
