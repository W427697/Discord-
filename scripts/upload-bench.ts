import { copy } from 'fs-extra';
import { join } from 'path';
import { BigQuery } from '@google-cloud/bigquery';

import { loadBench } from './bench';
import type { SaveBenchOptions } from './bench';
import { SANDBOX_DIRECTORY, CODE_DIRECTORY } from './utils/constants';
import { execaCommand } from './utils/exec';

const templateKey = process.argv[2];

const GCP_CREDENTIALS = JSON.parse(process.env.GCP_CREDENTIALS || '{}');
const sandboxDir = process.env.SANDBOX_ROOT || SANDBOX_DIRECTORY;
const templateSandboxDir = templateKey && join(sandboxDir, templateKey.replace('/', '-'));

export interface BenchResults {
  branch: string;
  commit: string;
  timestamp: string;
  label: string;
  installTime: number;
  installSize: number;
  startManagerBuild: number;
  startPreviewBuild: number;
  startManagerRender: number;
  startPreviewRender: number;
  buildTime: number;
  browseManagerRender: number;
  browsePreviewRender: number;
  browseSizeTotal: number;
  browseSizeManagerTotal: number;
  browseSizeManagerVendors: number;
  browseSizeManagerUiDll: number;
  browseSizePreviewTotal: number;
  browseSizePreviewVendors: number;
  browseSizePreviewDocsDll: number;
}

const uploadBench = async () => {
  const keys = ['build', 'dev', 'bench-build', 'bench-dev'] as SaveBenchOptions['key'][];
  const results = {} as Record<string, any>;

  await Promise.all(
    keys.map(async (key) => {
      try {
        const val = await loadBench({ key, rootDir: templateSandboxDir });
        results[key] = val;
        console.log({ key, val });
      } catch (err) {
        console.log(`Failed to load bench for the key ${key}:`, err);
      }
    })
  );
  const row = {
    branch:
      process.env.CIRCLE_BRANCH || (await execaCommand('git rev-parse --abbrev-ref HEAD')).stdout,
    commit: process.env.CIRCLE_SHA1 || (await execaCommand('git rev-parse HEAD')).stdout,
    timestamp: new Date().toISOString(),
    label: templateKey,
    installTime: 0,
    installSize: 0,
    startManagerBuild: 0,
    startPreviewBuild: results.dev?.time || 0,
    startManagerRender: results['bench-dev']?.managerLoaded || 0,
    startPreviewRender: results['bench-dev']?.previewLoaded || 0,
    buildTime: results.build?.time || 0,
    browseManagerRender: results['bench-build']?.managerLoaded || 0,
    browsePreviewRender: results['bench-build']?.previewLoaded || 0,
    browseSizeTotal: 0,
    browseSizeManagerTotal: 0,
    browseSizeManagerVendors: 0,
    browseSizeManagerUiDll: 0,
    browseSizePreviewTotal: 0,
    browseSizePreviewVendors: 0,
    browseSizePreviewDocsDll: 0,
  } as BenchResults;

  const bigquery = new BigQuery({
    projectId: GCP_CREDENTIALS.project_id,
    credentials: GCP_CREDENTIALS,
  });
  const dataset = bigquery.dataset('benchmark_results');
  const appTable = dataset.table('bench_new');

  console.log('inserting', row);
  await appTable.insert([row]);
  console.log('inserted');

  await copy(`${templateSandboxDir}/bench-results`, `${CODE_DIRECTORY}/bench-results`);
};

uploadBench().then(() => {
  console.log('done');
});
