import { RawSourceMap } from 'source-map';
import { transform, Result } from '../babel/sb-runtime-plugin';

import { Loader } from '../types/webpack';

const previewEntryloader: Loader = function previewEntryloader(
  source,
  inputSourceMap: RawSourceMap
) {
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

export { previewEntryloader as default };
