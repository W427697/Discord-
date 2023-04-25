import { join } from 'path';
import { PORT } from './serve';
import type { Task } from '../task';
import { browse, saveBench, storybookConfig } from '../bench';

export const benchBuild: Task & { port: number } = {
  description: 'Run benchmarks against a sandbox in prod mode',
  dependsOn: ['serve'],
  port: PORT,
  async ready() {
    return false;
  },
  async run({ sandboxDir, selectedTask }) {
    const url = `http://localhost:${this.port}?path=/story/example-button--primary`;
    const result = await browse(url, storybookConfig);

    await saveBench(result, {
      key: selectedTask as 'bench-build' | 'bench-dev',
      rootDir: sandboxDir,
    });
  },
};
