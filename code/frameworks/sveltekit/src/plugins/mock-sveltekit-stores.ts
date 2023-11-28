import { resolve } from 'node:path';
import type { Plugin } from 'vite';

export async function mockSveltekitStores() {
  const { mergeConfig } = await import('vite');
  return {
    name: 'storybook:sveltekit-mock-stores',
    enforce: 'post',
    config: (config) =>
      mergeConfig(config, {
        resolve: {
          alias: {
            $app: resolve(__dirname, '../src/mocks/app/'),
          },
        },
      }),
  } satisfies Plugin;
}
