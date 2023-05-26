import * as path from 'path';
import slash from 'slash';
import * as glob from 'glob';
import { normalizeStories } from '@storybook/core-common';

import type { Options } from '@storybook/types';
import { normalizePath } from 'vite';

export async function listStories(options: Options) {
  const raw = await options.presets.apply('stories', [], options);
  const normalizeOptions = {
    configDir: options.configDir,
    workingDir: options.configDir,
  };
  const normalized = normalizeStories(raw, normalizeOptions).map(({ directory, files }) => {
    const pattern = path.join(directory, files);
    const absolutePattern = path.isAbsolute(pattern)
      ? pattern
      : path.join(options.configDir, pattern);

    return glob.sync(slash(absolutePattern), { follow: true });
  });

  return normalized.reduce((carry, stories) => carry.concat(stories.map(normalizePath)), []);
}
