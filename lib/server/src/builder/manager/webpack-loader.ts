import { RawSourceMap } from 'source-map';
import { transform, Result } from './babel-plugin';

import { Loader } from '../../types/webpack';

const managerEntryloader: Loader = function managerEntryloader(
  source: string,
  inputSourceMap: RawSourceMap
) {
  const callback = this.async();
  this.cacheable(true);

  // console.log(this.request);

  transform(source, inputSourceMap, {}).then(({ code, map }: Result) => {
    callback(null, `${code}; console.log("here")`, map);
    // return callback(null, code, map);
  });
} as Loader;

export { managerEntryloader as default };
