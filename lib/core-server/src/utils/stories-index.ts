import type { NormalizedStoriesSpecifier, StorybookConfig } from '@storybook/core-common';

import { StoryIndexGenerator } from './StoryIndexGenerator';

let generator: StoryIndexGenerator;

export const getStoryIndexGenerator = async ({
  configDir,
  workingDir = process.cwd(),
  normalizedStories,
  features,
}: {
  configDir: string;
  workingDir?: string;
  features: StorybookConfig['features'];
  normalizedStories: NormalizedStoriesSpecifier[];
}) => {
  if (generator) {
    return generator;
  }

  generator = new StoryIndexGenerator(normalizedStories, {
    configDir,
    workingDir,
    storiesV2Compatibility: !features?.breakingChangesV7 && !features?.storyStoreV7,
    storyStoreV7: features?.storyStoreV7,
  });

  await generator.initialize();

  return generator;
};
