import { PORT } from './serve';
import type { Task } from '../task';
import { browse, storybookConfig } from '../bench';

export const benchBuild: Task & { port: number } = {
  description: 'Run benchmarks against a sandbox in prod mode',
  dependsOn: ['serve'],
  port: PORT,
  async ready() {
    return false;
  },
  async run() {
    const url = `http://localhost:${this.port}?path=/story/example-button--primary`;
    console.log({ url });
    const result = await browse(url, storybookConfig);
    console.log({ result });
  },
};
