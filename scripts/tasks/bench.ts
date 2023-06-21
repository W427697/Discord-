import type { Task } from '../task';

import { PORT, dev } from './dev';
import { serve } from './serve';

export const bench: Task = {
  description: 'Run benchmarks against a sandbox in dev mode',
  dependsOn: ['build'],
  async ready() {
    return false;
  },

  async run(details, options) {
    const { browse, saveBench, storybookConfig } = await import('../bench');
    const url = `http://localhost:${PORT}?path=/story/example-button--primary`;

    const devController = await dev.run(details, options);
    if (!devController) {
      throw new Error('dev: controller is null');
    }

    const devBrowseResult = await browse(url, storybookConfig);
    devController.abort();

    const serveController = await serve.run(details, options);
    if (!serveController) {
      throw new Error('serve: controller is null');
    }

    const buildBrowseResult = await browse(url, storybookConfig);
    serveController.abort();

    await saveBench(
      {
        devManagerLoaded: devBrowseResult.managerLoaded,
        devPreviewLoaded: devBrowseResult.previewLoaded,
        buildManagerLoaded: buildBrowseResult.managerLoaded,
        buildPreviewLoaded: buildBrowseResult.previewLoaded,
      },
      {
        rootDir: details.sandboxDir,
      }
    );
  },
};
