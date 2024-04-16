/* eslint-disable no-underscore-dangle */
import type { Channel } from '@storybook/channels';
import { SAVE_STORY_REQUEST, SAVE_STORY_RESPONSE } from '@storybook/core-events';
import { storyNameFromExport, toId } from '@storybook/csf';
import { readCsf, writeCsf } from '@storybook/csf-tools';

import { basename, join } from 'path';
import { updateArgsInCsfFile } from './update-args-in-csf-file';
import { duplicateStoryWithNewName } from './duplicate-story-with-new-name';
// import { sendTelemetryError } from '../withTelemetry';

interface SaveStoryRequest {
  id: string;
  payload: {
    csfId: string;
    importPath: string;
    args: Record<string, any>;
    name?: string;
  };
}

type SaveStoryResponse = (
  | { id: string; success: true }
  | { id: string; success: false; error: string }
) & {
  payload: {
    csfId: string;
    newStoryId?: string;
    newStoryName?: string;
    sourceFileName?: string;
    sourceStoryName?: string;
  };
};

export function initializeSaveFromControls(channel: Channel) {
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

      // open the story file
      const csf = await readCsf(sourceFilePath, {
        makeTitle: (userTitle: string) => userTitle || 'myTitle',
      });

      const parsed = csf.parse();
      const stories = Object.entries(parsed._stories);

      const [componentId, storyId] = csfId.split('--');
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
    } catch (e: any) {
      // sendTelemetryError(channel, e);
      channel.emit(SAVE_STORY_RESPONSE, {
        id,
        success: false,
        error: e.message,
        payload: {
          csfId,
          newStoryId,
          newStoryName,
          sourceFileName,
          sourceStoryName,
        },
      } satisfies SaveStoryResponse);

      console.error(`Error writing to ${sourceFilePath}:`, e.stack || e.message || e.toString());
    }
  });
}
