import { transform, Result } from '../babel/sb-metadata-plugin';

import { Loader } from '../types/webpack';

const managerEntryloader: Loader = function managerEntryloader(source, inputSourceMap) {
  const callback = this.async();
  this.cacheable(true);

  transform(source.toString('utf8'), inputSourceMap, {})
    .then(({ code, map }: Result) => {
      callback(null, `${code}`, map);
    })
    .catch(e => {
      callback(e);
    });
};

export { managerEntryloader as default };
