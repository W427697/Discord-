// eslint-disable-next-line import/no-extraneous-dependencies
import 'jest-preset-angular/setup-jest';

import { webcrypto } from 'node:crypto';

global.setImmediate =
  global.setImmediate || (((fn: any, ...args: any[]) => global.setTimeout(fn, 0, ...args)) as any);

Object.defineProperty(window, 'crypto', {
  get() {
    return webcrypto;
  },
});

global.EventSource = class {} as any;
