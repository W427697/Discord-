import React from 'react';
import { join } from 'path';
import { StoryIndexGenerator } from '@storybook/core-server';
import { composeStories } from '@storybook/react';
import type { DocsOptions } from '@storybook/types';
import { loadAllPresets, loadMainConfig, normalizeStories } from '@storybook/core-common';
import { logger } from '@storybook/node-logger';

const getIndex = async () => {
  // FIXME
  const options = {
    configDir: join(process.cwd(), '.storybook'),
    packageJson: {},
  };
  const config = await loadMainConfig(options);
  const { framework } = config;
  const corePresets = [];

  const frameworkName = typeof framework === 'string' ? framework : framework?.name;
  if (frameworkName) {
    corePresets.push(join(frameworkName, 'preset'));
  } else {
    logger.warn(`you have not specified a framework in your ${options.configDir}/main.js`);
  }

  const presets = await loadAllPresets({
    corePresets: [
      require.resolve('@storybook/core-server/dist/presets/common-preset'),
      ...corePresets,
    ],
    overridePresets: [],
    ...options,
  });

  const workingDir = process.cwd();
  const directories = {
    configDir: options.configDir,
    workingDir,
  };

  const [indexers, storyIndexers, stories, docsOptions] = await Promise.all([
    presets.apply('indexers', []),
    presets.apply('storyIndexers', []),
    presets.apply('stories'),
    presets.apply<DocsOptions>('docs', {}),
  ]);

  const normalizedStories = normalizeStories(stories, directories);
  const generator = new StoryIndexGenerator(normalizedStories, {
    ...directories,
    indexers,
    storyIndexers,
    docs: docsOptions,
    storiesV2Compatibility: false,
    storyStoreV7: true,
  });

  await generator.initialize();
  const index = await generator.getIndex();
  return index;
};

export const getStory = async (searchParams: any) => {
  const { _id: storyId } = searchParams;
  const index = await getIndex();
  const storyEntry = index.entries[storyId];
  console.log({ storyEntry });
  const imported = await import(storyEntry.importPath);
  console.log({ imported });
  const composed = composeStories(imported);
  console.log({ composed });
  const Component = composed[storyEntry.name];
  // @ts-expect-error FIXME
  return <Component {...searchParams} />;
};
