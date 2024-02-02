import { join } from 'node:path';
import { ensureDir, writeJSON, readJSON } from '@ndelangen/fs-extra-unified';
import type { Page } from 'playwright-core';
import type { BenchResults } from './types';
import { readdir } from 'node:fs/promises';

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
  const existing = await ensureDir(dirName).then(() => {
    return readJSON(join(dirName, fileName)).catch(() => ({}));
  });
  await writeJSON(join(dirName, fileName), { ...existing, ...data }, { spaces: 2 });
};

export const loadBench = async (options: SaveBenchOptions): Promise<Partial<BenchResults>> => {
  const dirName = join(options.rootDir || process.cwd(), 'bench');
  const files = await readdir(dirName);
  return files.reduce(async (acc, fileName) => {
    const data = await readJSON(join(dirName, fileName));
    return { ...(await acc), ...data };
  }, Promise.resolve({}));
  // return readJSON(join(dirname, `bench.json`));
};

export async function getPreviewPage(page: Page) {
  await page.waitForFunction(() => {
    return document.querySelector('iframe')?.contentDocument.readyState === 'complete';
  });
  const previewPage = await page.frame({ url: /iframe.html/ }).page();
  return previewPage;
}
