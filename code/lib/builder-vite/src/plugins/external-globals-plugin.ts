import { hrtime } from 'node:process';
import { globals } from '@storybook/preview/globals';
import type { Plugin } from 'vite';
import { viteExternalsPlugin } from 'vite-plugin-externals';

type ConfigHookFn = Extract<
  ReturnType<typeof viteExternalsPlugin>['config'],
  (...args: any[]) => any
>;
type TransformHookFn = Extract<
  ReturnType<typeof viteExternalsPlugin>['transform'],
  (...args: any[]) => any
>;

export async function externalsGlobalsPlugin() {
  let configTiming = BigInt(0);
  let transformTiming = BigInt(0);
  const plugin = viteExternalsPlugin(globals, { useWindow: false });
  return {
    ...plugin,
    name: 'storybook:external-globals-plugin',
    // wrap config hook to fix issues from `vite-plugin-externals`
    async config(...configArgs) {
      const startTime = hrtime.bigint();
      const config = await (plugin.config as ConfigHookFn)(...configArgs);
      const endTime = hrtime.bigint();
      configTiming += endTime - startTime;
      return {
        resolve: {
          alias: config?.resolve?.alias,
        },
      };
    },
    async transform(...transformArgs) {
      const startTime = hrtime.bigint();
      const transform = await (plugin.transform as TransformHookFn)(...transformArgs);
      const endTime = hrtime.bigint();
      transformTiming += endTime - startTime;
      return transform;
    },
    configResolved() {
      console.log({
        configTiming: `${Number(configTiming) / 1000000000} sec`,
      });
    },
    buildEnd() {
      console.log({
        transformTiming: `${Number(transformTiming) / 1000000000} sec`,
      });
    },
  } satisfies Plugin;
}
