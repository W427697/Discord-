import { dirname, join } from 'node:path';

export const DEBOUNCE = 100;

export const defaultStaticDirs = [
  {
    from: join(dirname(require.resolve('@storybook/manager/package.json')), 'static'),
    to: '/sb-common-assets',
  },
];
