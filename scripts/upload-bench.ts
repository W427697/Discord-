import { copy } from 'fs-extra';
import { join } from 'path';
import { BigQuery } from '@google-cloud/bigquery';

import { loadBench } from './bench';
import { SANDBOX_DIRECTORY, CODE_DIRECTORY } from './utils/constants';
import { execaCommand } from './utils/exec';

const templateKey = process.argv[2];

const GCP_CREDENTIALS = JSON.parse(process.env.GCP_CREDENTIALS || '{}');
const sandboxDir = process.env.SANDBOX_ROOT || SANDBOX_DIRECTORY;
const templateSandboxDir = templateKey && join(sandboxDir, templateKey.replace('/', '-'));

// NOTE: this must be kept in sync with ./bench/bench.schema, which defines
// the table schema in BigQuery
export interface BenchResults {
  branch: string;
  commit: string;
  timestamp: string;
  label: string;

  createTime: number;
  generateTime: number;
  initTime: number;
  createSize: number;
  generateSize: number;
  initSize: number;
  diffSize: number;
  buildTime: number;
  buildSize: number;
  buildSbAddonsSize: number;
  buildSbCommonSize: number;
  buildSbManagerSize: number;
  buildSbPreviewSize: number;
  buildStaticSize: number;
  buildPrebuildSize: number;
  buildPreviewSize: number;
  devPreviewResponsive: number;
  devManagerResponsive: number;
  devManagerLoaded: number;
  devPreviewLoaded: number;
  buildManagerLoaded: number;
  buildPreviewLoaded: number;
}

const defaults: Record<keyof BenchResults, null> = {
  branch: null,
  commit: null,
  timestamp: null,
  label: null,

  createTime: null,
  generateTime: null,
  initTime: null,
  createSize: null,
  generateSize: null,
  initSize: null,
  diffSize: null,
  buildTime: null,
  buildSize: null,
  buildSbAddonsSize: null,
  buildSbCommonSize: null,
  buildSbManagerSize: null,
  buildSbPreviewSize: null,
  buildStaticSize: null,
  buildPrebuildSize: null,
  buildPreviewSize: null,
  devPreviewResponsive: null,
  devManagerResponsive: null,
  devManagerLoaded: null,
  devPreviewLoaded: null,
  buildManagerLoaded: null,
  buildPreviewLoaded: null,
};

const uploadBench = async () => {
  const results = await loadBench({ rootDir: templateSandboxDir });

  const row = {
    ...defaults,
    branch:
      process.env.CIRCLE_BRANCH || (await execaCommand('git rev-parse --abbrev-ref HEAD')).stdout,
    commit: process.env.CIRCLE_SHA1 || (await execaCommand('git rev-parse HEAD')).stdout,
    timestamp: new Date().toISOString(),
    label: templateKey,
    ...results,
  } as BenchResults;

  const store = new BigQuery({
    projectId: GCP_CREDENTIALS.project_id,
    credentials: GCP_CREDENTIALS,
  });
  const dataset = store.dataset('benchmark_results');
  const appTable = dataset.table('bench2');

  await appTable.insert([row]);

  // for CI artifacts
  await copy(
    `${templateSandboxDir}/bench.json`,
    `${CODE_DIRECTORY}/bench-results/${templateSandboxDir}.json`
  );
};

uploadBench().then(() => {
  console.log('done');
});
