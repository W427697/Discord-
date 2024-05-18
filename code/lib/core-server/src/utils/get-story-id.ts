import type { Options } from '@storybook/core/dist/types';
import dedent from 'ts-dedent';
import { normalizeStories, normalizeStoryPath } from '@storybook/core/dist/common';
import path from 'path';
import { sanitize, storyNameFromExport, toId } from '@storybook/csf';
import { userOrAutoTitleFromSpecifier } from '@storybook/core/dist/preview-api';
import { posix } from './posix';

interface StoryIdData {
  storyFilePath: string;
  exportedStoryName: string;
}

export async function getStoryId(data: StoryIdData, options: Options) {
  const stories = await options.presets.apply('stories', [], options);

  const workingDir = process.cwd();

  const normalizedStories = normalizeStories(stories, {
    configDir: options.configDir,
    workingDir,
  });

  const relativePath = path.relative(workingDir, data.storyFilePath);
  const importPath = posix(normalizeStoryPath(relativePath));

  const autoTitle = normalizedStories
    .map((normalizeStory) => userOrAutoTitleFromSpecifier(importPath, normalizeStory))
    .filter(Boolean)[0];

  if (autoTitle === undefined) {
    // eslint-disable-next-line local-rules/no-uncategorized-errors
    throw new Error(dedent`
    The new story file was successfully generated, but we are unable to index it. Please ensure that the new Story file is matched by the 'stories' glob pattern in your Storybook configuration.
    `);
  }

  const storyName = storyNameFromExport(data.exportedStoryName);

  const storyId = toId(autoTitle as string, storyName);
  const kind = sanitize(autoTitle);

  return { storyId, kind };
}
