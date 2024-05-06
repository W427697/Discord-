import type { Server } from 'connect';
import { writeJSON } from 'fs-extra';

import type { NormalizedStoriesSpecifier, StoryIndex } from '@storybook/types';
import debounce from 'lodash/debounce.js';

import { STORY_INDEX_INVALIDATED } from '@storybook/core-events';
import type { StoryIndexGenerator } from './StoryIndexGenerator';
import { watchStorySpecifiers } from './watch-story-specifiers';
import type { ServerChannel } from './get-server-channel';

export const DEBOUNCE = 100;

export async function extractStoriesJson(
  outputFile: string,
  initializedStoryIndexGenerator: Promise<StoryIndexGenerator>,
  transform?: (index: StoryIndex) => any
) {
  const generator = await initializedStoryIndexGenerator;
  const storyIndex = await generator.getIndex();
  await writeJSON(outputFile, transform ? transform(storyIndex) : storyIndex);
}

export function useStoriesJson({
  app,
  initializedStoryIndexGenerator,
  workingDir = process.cwd(),
  serverChannel,
  normalizedStories,
}: {
  app: Server;
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

  app.use('/index.json', async (req, res) => {
    try {
      const generator = await initializedStoryIndexGenerator;
      const index = await generator.getIndex();
      res.setHeader('Content-Type', 'application/json');
      res.write(JSON.stringify(index));
      res.end();
    } catch (err) {
      res.statusCode = 500;
      res.write(err instanceof Error ? err.toString() : String(err));
      res.end();
    }
  });
}
