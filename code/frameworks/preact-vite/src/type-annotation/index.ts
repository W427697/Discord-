import { createUnplugin } from 'unplugin';
import { Worker } from 'node:worker_threads';
import { join } from 'node:path';
import { createService } from './rpc';

const STORY_MATCHER = /\.(story|stories)\.[jt]sx?$/;

const defaultStoryMatcher = (id: string) => STORY_MATCHER.test(id);

export interface PluginOptions {
  storyMatcher?: (name: string) => boolean;
  rootDir: string;
}

const plugin = createUnplugin<PluginOptions>((options) => {
  const worker = new Worker(join(__dirname, 'type-annotation/worker.js'), {
    workerData: { options },
  });
  const service = createService(worker);

  return {
    name: 'unplugin-preact-addon-docs',
    transformInclude(id) {
      return (options?.storyMatcher ?? defaultStoryMatcher)(id);
    },
    async transform(code, id) {
      const components = await service.analyze(id);
      return `${code};
console.warn(${JSON.stringify(components, null, 2)});
`;
    },
  };
});

export const { esbuild, webpack, vite, rollup } = plugin;
