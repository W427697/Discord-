import Cache from 'file-system-cache';

export type Options = Parameters<typeof Cache>['0'];
export type FileSystemCache = ReturnType<typeof Cache>;

export function createFileSystemCache(options: Options): FileSystemCache {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const V = typeof Cache === 'function' ? Cache : Cache.default;
  return V(options);
}
