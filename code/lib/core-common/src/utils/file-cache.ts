import Cache from 'file-system-cache';

export type Options = Parameters<typeof Cache>['0'];
export type FileSystemCache = ReturnType<typeof Cache>;

export function createFileSystemCache(options: Options): FileSystemCache {
  const V = typeof Cache === 'function' ? Cache : Cache.default;
  console.log({ V });
  return V(options);
}
