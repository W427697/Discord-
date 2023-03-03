import { createUnplugin } from 'unplugin';
import { Worker } from 'node:worker_threads';
import { join } from 'node:path';
import { createService } from './rpc';

const STORY_MATCHER = /\.(story|stories)\.[jt]sx?$/;

const defaultStoryMatcher = (id: string) => STORY_MATCHER.test(id);

interface PluginOptions {
  storyMatcher?: (name: string) => boolean;
}

const plugin = createUnplugin((options: PluginOptions) => {
  const worker = new Worker(join(__dirname, 'type-annotation/worker.js'));
  const service = createService(worker);

  return {
    name: 'unplugin-preact-addon-docs',
    transformInclude(id) {
      return (options?.storyMatcher ?? defaultStoryMatcher)(id);
    },
    async transform(code, id) {
      return `${code};\nconsole.warn(${await service.string()});`;
    },
  };
});

export const { esbuild, webpack, vite, rollup } = plugin;
