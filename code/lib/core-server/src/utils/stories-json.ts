import type { FastifyInstance } from 'fastify';
import { writeJSON } from 'fs-extra';

import type { NormalizedStoriesSpecifier } from '@storybook/core-common';
import type { StoryIndex, StoryIndexV3 } from '@storybook/store';
import debounce from 'lodash/debounce';

import { STORY_INDEX_INVALIDATED } from '@storybook/core-events';
import { StoryIndexGenerator } from './StoryIndexGenerator';
import { watchStorySpecifiers } from './watch-story-specifiers';
import { ServerChannel } from './get-server-channel';

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

  router.get('/index.json', async (request, reply) => {
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

  router.get('/stories.json', async (request, reply) => {
    try {
      const generator = await initializedStoryIndexGenerator;
      const index = convertToIndexV3(await generator.getIndex());
      reply.header('Content-Type', 'application/json');
      reply.send(JSON.stringify(index));
    } catch (err) {
      reply.status(500);
      reply.send(err.message);
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
