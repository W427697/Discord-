import type { FastifyInstance } from 'fastify';
import fs from 'fs-extra';
import type { NormalizedStoriesSpecifier } from '@storybook/core-common';
import { debounce } from 'lodash';
import { STORY_INDEX_INVALIDATED } from '@storybook/core-events';
import { StoryIndexGenerator } from './StoryIndexGenerator';
import { watchStorySpecifiers } from './watch-story-specifiers';
import { ServerChannel } from './get-server-channel';

export const DEBOUNCE = 100;

export async function extractStoriesJson(
  outputFile: string,
  initializedStoryIndexGenerator: Promise<StoryIndexGenerator>
) {
  const generator = await initializedStoryIndexGenerator;
  const storyIndex = await generator.getIndex();
  await fs.writeJson(outputFile, storyIndex);
}

export function useStoriesJson({
  router,
  initializedStoryIndexGenerator,
  workingDir = process.cwd(),
  serverChannel,
  normalizedStories,
}: {
  router: FastifyInstance;
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

  router.get('/stories.json', async (request, reply) => {
    try {
      const generator = await initializedStoryIndexGenerator;
      const index = await generator.getIndex();
      reply.header('Content-Type', 'application/json');
      reply.send(JSON.stringify(index));
    } catch (err) {
      reply.status(500);
      reply.send(err.message);
    }
  });
}
