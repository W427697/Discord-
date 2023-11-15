import { join } from 'path';
import fs from 'fs-extra';
import type { Page } from 'playwright-core';
import type { BenchResults } from './types';

export const now = () => new Date().getTime();

export interface SaveBenchOptions {
  rootDir?: string;
}

export const saveBench = async (
  key: string,
  data: Partial<BenchResults>,
  options: SaveBenchOptions
) => {
  const dirName = join(options.rootDir || process.cwd(), 'bench');
  const fileName = `${key}.json`;
  const existing = await fs.ensureDir(dirName).then(() => {
    return fs.readJSON(join(dirName, fileName)).catch(() => ({}));
  });
  await fs.writeJSON(join(dirName, fileName), { ...existing, ...data }, { spaces: 2 });
};

export const loadBench = async (options: SaveBenchOptions): Promise<Partial<BenchResults>> => {
  const dirName = join(options.rootDir || process.cwd(), 'bench');
  const files = await fs.readdir(dirName);
  return files.reduce(async (acc, fileName) => {
    const data = await fs.readJSON(join(dirName, fileName));
    return { ...(await acc), ...data };
  }, Promise.resolve({}));
  // return fs.readJSON(join(dirname, `bench.json`));
};

export async function getPreviewPage(page: Page) {
  await page.waitForFunction(() => {
    return document.querySelector('iframe')?.contentDocument.readyState === 'complete';
  });
  const previewPage = await page.frame({ url: /iframe.html/ }).page();
  return previewPage;
}
