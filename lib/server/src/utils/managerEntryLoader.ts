import path from 'path';

import { Loader } from './webpack-loader-types';

const managerEntryloader = function managerEntryloader(source) {
  const callback = this.async();
  this.cacheable(true);

  callback(null, source);
} as Loader;

export { managerEntryloader as default };
