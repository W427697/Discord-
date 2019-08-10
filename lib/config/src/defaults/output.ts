import path from 'path';

import { getCacheDir } from '../paths';

import { Output } from '../types/values';

const cacheDir = getCacheDir();

export const output: Output = {
  compress: false,
  location: path.join(cacheDir, 'out'),
  preview: true,
};
