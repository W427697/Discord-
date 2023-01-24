import { globals } from '@storybook/preview/globals';
import type { Plugin } from 'vite';
import { viteExternalsPlugin } from 'vite-plugin-externals';

type ConfigHookFn = Extract<
  ReturnType<typeof viteExternalsPlugin>['config'],
  (...args: any[]) => any
>;

export async function externalsGlobalsPlugin() {
  const plugin = viteExternalsPlugin(globals, { useWindow: false });
  return {
    ...plugin,
    name: 'storybook:external-globals-plugin',
    // wrap config hook to fix issues from `vite-plugin-externals`
    async config(...configArgs) {
      const config = await (plugin.config as ConfigHookFn)(...configArgs);
      return {
        resolve: {
          alias: config?.resolve?.alias,
        },
      };
    },
  } satisfies Plugin;
}
