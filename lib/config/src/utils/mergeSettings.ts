import { Config } from '../types/files';

export const mergeSettings = (a: Config, b: Config = {}): Config =>
  Object.assign(
    {},
    a,
    b,
    Object.entries(a).reduce(
      (acc, [k, v]) => ({
        ...acc,
        [k]: v.concat(b[k] || []),
      }),
      {}
    )
  );
