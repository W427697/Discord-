import Cache from 'file-system-cache';

export type Options = Parameters<typeof Cache>['0'];

export function createFileSystemCache(options: Options): ReturnType<typeof Cache> {
  return Cache(options);
}
