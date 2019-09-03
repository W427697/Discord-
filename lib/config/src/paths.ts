import fs from 'fs-extra';
import process from 'process';
import path from 'path';

import findCacheDir from 'find-cache-dir';
import pkgUp from 'pkg-up';
import gitDir from 'git-root-dir';
import * as F from './types/files';

export const getConfigFileName = (base: string) => `${base}.config.js`;

export const getConfigFilePath = (name: string) =>
  path.join(getCacheDir(), getConfigFileName(name));

export const getConfigPath = async (fileName: F.FileName): Promise<string> => {
  const cwd = process.cwd();

  const locations = {
    cwd: async () => cwd, // user's current working directory
    dot: async () => '.', //
    main: async () => path.dirname(require.main.filename),
    package: async () => {
      // look up to where package.json is, and use that directory
      const r = await pkgUp({ cwd });
      if (r) {
        return path.dirname(r);
      }
      return r;
    },
    git: async () => gitDir(cwd), // look up to where .git is and use that directory
  };

  type Locations = keyof typeof locations;

  const fullPath = await Object.keys(locations).reduce(async (acc, l: Locations) => {
    const prevResult = await acc;
    if (prevResult) {
      return prevResult;
    }
    const location = await locations[l]();

    if (!location) {
      return prevResult;
    }
    const p = path.join(location, fileName);
    const result = (await fs.pathExists(p)) ? p : prevResult;

    return result;
  }, Promise.resolve(''));

  // if empty string, return undefined
  return fullPath || undefined;
};

export const getCacheDir = () => findCacheDir({ name: 'storybook' });

export const getCoreDir = () =>
  path.join(path.dirname(require.resolve('@storybook/core/package.json')), 'dist');

export const getStorybookConfigPath = async () => {
  const configFileName = 'storybook.config.js';
  return getConfigPath(configFileName);
};
