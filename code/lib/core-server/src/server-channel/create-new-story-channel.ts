import type { Options } from '@storybook/types';
import type { Channel } from '@storybook/channels';
import { CREATE_NEW_STORYFILE, CREATE_NEW_STORYFILE_RESULT } from '@storybook/core-events';
import dedent from 'ts-dedent';
import { normalizeStories, normalizeStoryPath } from '@storybook/core-common';
import path from 'path';
import fs from 'fs';
import { storyNameFromExport, toId } from '@storybook/csf';
import slash from 'slash';
import { userOrAutoTitleFromSpecifier } from '@storybook/preview-api';
import { getNewStoryFile } from '../utils/get-new-story-file';

interface Data {
  // The filepath of the component for which the Story should be generated for (relative to the project root)
  filepath: string;
  // The name of the exported component
  componentExportName: string;
  // is default export
  default: boolean;
}

interface Result {
  success: true | false;
  result: null | {
    storyId: string;
  };
  error: null | string;
}

export function initCreateNewStoryChannel(channel: Channel, options: Options) {
  /**
   * Listens for events to create a new storyfile
   */
  channel.on(CREATE_NEW_STORYFILE, async (data: Data) => {
    try {
      const { storyFilePath, exportedStoryName, storyFileContent } = await getNewStoryFile(
        data,
        options
      );

      fs.writeFileSync(storyFilePath, storyFileContent, {
        encoding: 'utf-8',
      });

      const storyId = await getStoryId(options, storyFilePath, exportedStoryName);

      channel.emit(CREATE_NEW_STORYFILE_RESULT, {
        success: true,
        result: {
          storyId,
        },
        error: null,
      } satisfies Result);
    } catch (e: any) {
      channel.emit(CREATE_NEW_STORYFILE_RESULT, {
        success: false,
        result: null,
        error: dedent`
          An error occurred while creating a new story:
          ${e?.message}
        `,
      } satisfies Result);
    }
  });

  return channel;
}

export async function getStoryId(
  options: Options,
  storyFilePath: string,
  exportedStoryName: string
) {
  const stories = await options.presets.apply('stories', [], options);

  const workingDir = process.cwd();

  const normalizedStories = normalizeStories(stories, {
    configDir: options.configDir,
    workingDir,
  });

  const relativePath = path.relative(workingDir, storyFilePath);
  const importPath = slash(normalizeStoryPath(relativePath));

  const autoTitle = normalizedStories
    .map((normalizeStory) => userOrAutoTitleFromSpecifier(importPath, normalizeStory))
    .filter(Boolean)[0];

  if (autoTitle === undefined) {
    // eslint-disable-next-line local-rules/no-uncategorized-errors
    throw new Error(dedent`
    The generation of your new Story file was successful! But it seems that we are unable to index it.
    Please make sure that the new Story file is matched by the 'stories' glob pattern in your Storybook configuration.
    The location of the new Story file is: ${relativePath}
  `);
  }

  const storyName = storyNameFromExport(exportedStoryName);
  const storyId = toId(autoTitle as string, storyName);

  return storyId;
}
