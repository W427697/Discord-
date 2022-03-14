import fs from 'fs-extra';
import {
  Options,
  NormalizedStoriesSpecifier,
  normalizeStories,
  StorybookConfig,
} from '@storybook/core-common';

import { Request, Response, Router } from 'express';
import { debounce } from 'lodash';
import { STORY_INDEX_INVALIDATED } from '@storybook/core-events';
import { getStorybookMetadata } from '@storybook/telemetry';
import type { StorybookMetadata } from '@storybook/telemetry';
import { ServerChannel } from './get-server-channel';
import { StoryIndexGenerator } from './StoryIndexGenerator';
import { watchStorySpecifiers } from './watch-story-specifiers';

export async function extractStorybookMetadata(
  outputFile: string,
  normalizedStories?: NormalizedStoriesSpecifier[],
  options?: {
    configDir: string;
    workingDir: string;
    storiesV2Compatibility: boolean;
    packageJson: any;
    storyStoreV7: boolean;
  }
) {
  const storybookMetadata = getStorybookMetadata();

  if (!normalizedStories) {
    await fs.writeJson(outputFile, storybookMetadata);
  } else {
    // @TODO: extract all these normalizeStories + storyIndex stuff to be reused between stories.json and metadata.json
    const generator = new StoryIndexGenerator(normalizedStories, options);
    await generator.initialize();

    const index = await generator.getIndex();
    const storyCount = Object.keys(index.stories).length;
    const metadata: StorybookMetadata = {
      ...storybookMetadata,
      index: {
        storyCount,
        version: index.v,
      },
    };
    await fs.writeJson(outputFile, metadata);
  }
}

export async function useStorybookMetadata(
  router: Router,
  serverChannel: ServerChannel,
  options: Options,
  workingDir: string = process.cwd()
) {
  // @TODO: extract all these normalizeStories + storyIndex stuff to be reused between stories.json and metadata.json
  const normalizedStories = normalizeStories(await options.presets.apply('stories'), {
    configDir: options.configDir,
    workingDir,
  });
  const features = await options.presets.apply<StorybookConfig['features']>('features');
  const generator = new StoryIndexGenerator(normalizedStories, {
    configDir: options.configDir,
    workingDir,
    storiesV2Compatibility: !features?.breakingChangesV7 && !features?.storyStoreV7,
    storyStoreV7: features?.storyStoreV7,
  });

  let started = false;
  const maybeInvalidate = debounce(() => serverChannel.emit(STORY_INDEX_INVALIDATED), 1000, {
    leading: true,
  });
  async function ensureStarted() {
    if (started) return;
    started = true;

    watchStorySpecifiers(normalizedStories, { workingDir }, (specifier, path, removed) => {
      generator.invalidate(specifier, path, removed);
      maybeInvalidate();
    });

    await generator.initialize();
  }

  router.use('/metadata.json', async (req: Request, res: Response) => {
    await ensureStarted();

    let index;
    try {
      index = await generator.getIndex();
      // eslint-disable-next-line no-empty
    } catch (err) {}

    const metadata: StorybookMetadata = getStorybookMetadata();
    if (index) {
      metadata.index = {
        storyCount: Object.keys(index.stories).length,
        version: index.v,
      };
    }

    res.header('Content-Type', 'application/json');
    res.send(JSON.stringify(metadata));
  });
}
