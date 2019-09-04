import path from 'path';

import { getCacheDir } from '../dist/paths';

import { Output } from '../src/types/values';

const cacheDir = getCacheDir();

export const output: Output = {
  compress: false,
  location: path.join(cacheDir, 'out'),
  preview: true,
};
