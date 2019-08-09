import { Config } from './types';

export const merge = (a: Config, b: Config = {}): Config =>
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
