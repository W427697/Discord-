import { Router, Request, Response } from 'express';
import fs from 'fs-extra';
import type { StoryIndex } from '@storybook/store';
import type { NormalizedStoriesSpecifier } from '@storybook/core-common';
import { debounce } from 'lodash';
import { STORY_INDEX_INVALIDATED } from '@storybook/core-events';
import { StoryIndexGenerator } from './StoryIndexGenerator';
import { watchStorySpecifiers } from './watch-story-specifiers';
import { ServerChannel } from './get-server-channel';

export async function extractStoriesJson(outputFile: string, storiesIndex: StoryIndex) {
  await fs.writeJson(outputFile, storiesIndex);
}
export const DEBOUNCE = 100;

export async function useStoriesJson({
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

  router.use('/stories.json', async (req: Request, res: Response) => {
    try {
      const generator = await initializedStoryIndexGenerator;
      const index = await generator.getIndex();
      res.header('Content-Type', 'application/json');
      res.send(JSON.stringify(index));
    } catch (err) {
      res.status(500);
      res.send(err.message);
    }
  });
}
