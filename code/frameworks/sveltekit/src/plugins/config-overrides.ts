import { resolve } from 'node:path';
import { mergeConfig, type Plugin } from 'vite';

export function configOverrides() {
  return [
    {
      // SvelteKit sets SSR, we need it to be false when building
      name: 'storybook:sveltekit-overrides',
      apply: 'build',
      config: () => {
        return { build: { ssr: false } };
      },
    },
    {
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
    },
  ] satisfies Plugin[];
}
