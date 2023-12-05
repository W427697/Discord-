import { resolve } from 'node:path';
import type { Plugin } from 'vite';

export function mockSveltekitStores() {
  return {
    name: 'storybook:sveltekit-mock-stores',
    config: () => ({
      resolve: {
        alias: {
          '$app/forms': resolve(__dirname, '../src/mocks/app/forms'),
          '$app/navigation': resolve(__dirname, '../src/mocks/app/navigation'),
          '$app/store': resolve(__dirname, '../src/mocks/app/store'),
        },
      },
    }),
  } satisfies Plugin;
}
