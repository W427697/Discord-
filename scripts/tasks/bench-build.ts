import { PORT } from './serve';
import type { Task } from '../task';

export const benchBuild: Task & { port: number } = {
  description: 'Run benchmarks against a sandbox in prod mode',
  dependsOn: ['serve'],
  port: PORT,
  async ready() {
    return false;
  },
  async run({ sandboxDir, selectedTask }) {
    const { browse, saveBench, storybookConfig } = await import('../bench');
    const url = `http://localhost:${this.port}?path=/story/example-button--primary`;
    const result = await browse(url, storybookConfig);

    await saveBench(result, {
      key: selectedTask as 'bench-build' | 'bench-dev',
      rootDir: sandboxDir,
    });
  },
};
