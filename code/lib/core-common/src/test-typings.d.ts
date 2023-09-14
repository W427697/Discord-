import { vi } from 'vitest';
// TODO Check this
declare namespace vi {
  interface Matchers<R> {
    toMatchPaths(paths: string[]): R;
  }
}
