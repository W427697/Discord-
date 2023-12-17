import type { Router, Request, Response } from 'express';
import { writeJSON } from 'fs-extra';

import type { NormalizedStoriesSpecifier, StoryIndex, StoryIndexV3 } from '@storybook/types';
import debounce from 'lodash/debounce.js';

import { STORY_INDEX_INVALIDATED } from '@storybook/core-events';
import type { StoryIndexGenerator } from './StoryIndexGenerator';
import { watchStorySpecifiers } from './watch-story-specifiers';
import type { ServerChannel } from './get-server-channel';

export const DEBOUNCE = 100;
const logger = console;

export async function extractStoriesJson(
  outputFile: string,
  initializedStoryIndexGenerator: Promise<StoryIndexGenerator>,
  transform?: (index: StoryIndex) => any
) {
  const generator = await initializedStoryIndexGenerator;
  const storyIndex = await generator.getIndex();
  await writeJSON(outputFile, transform ? transform(storyIndex) : storyIndex);
}

export async function extractParameters(
  outputFile: string,
  initializedStoryIndexGenerator: Promise<StoryIndexGenerator>
) {
  const generator = await initializedStoryIndexGenerator;
  try {
    const storyParameters = await generator.getParameters();
    if (Object.keys(storyParameters?.parameters).length > 0) {
      await writeJSON(outputFile, storyParameters);
    }
  } catch (e: any) {
    // If ANY of the parameters fail, skip writing the file
    logger.warn(`Failed to extract story parameters: ${e.message}`);
  }
}

export function useStoriesJson({
  router,
  initializedStoryIndexGenerator,
  workingDir = process.cwd(),
  serverChannel,
  normalizedStories,
}: {
  router: Router;
  initializedStoryIndexGenerator: Promise<StoryIndexGenerator>;
  serverChannel: ServerChannel;
  workingDir?: string;
  normalizedStories: NormalizedStoriesSpecifier[];
}) {
  const maybeInvalidate = debounce(() => serverChannel.emit(STORY_INDEX_INVALIDATED), DEBOUNCE, {
    leading: true,
  });
  watchStorySpecifiers(normalizedStories, { workingDir }, async (specifier, path, removed) => {
    const generator = await initializedStoryIndexGenerator;
    generator.invalidate(specifier, path, removed);
    maybeInvalidate();
  });

  router.use('/index.json', async (req: Request, res: Response) => {
    try {
      const generator = await initializedStoryIndexGenerator;
      const index = await generator.getIndex();
      res.header('Content-Type', 'application/json');
      res.send(JSON.stringify(index));
    } catch (err) {
      res.status(500);
      res.send(err instanceof Error ? err.toString() : String(err));
    }
  });

  router.use('/stories.json', async (req: Request, res: Response) => {
    try {
      const generator = await initializedStoryIndexGenerator;
      const index = convertToIndexV3(await generator.getIndex());
      res.header('Content-Type', 'application/json');
      res.send(JSON.stringify(index));
    } catch (err) {
      res.status(500);
      res.send(err instanceof Error ? err.toString() : String(err));
    }
  });
}

export const convertToIndexV3 = (index: StoryIndex): StoryIndexV3 => {
  const { entries } = index;
  const stories = Object.entries(entries).reduce((acc, [id, entry]) => {
    const { type, ...rest } = entry;
    acc[id] = {
      ...rest,
      kind: rest.title,
      story: rest.name,
      parameters: {
        __id: rest.id,
        docsOnly: type === 'docs',
        fileName: rest.importPath,
      },
    };
    return acc;
  }, {} as StoryIndexV3['stories']);
  return {
    v: 3,
    stories,
  };
};
