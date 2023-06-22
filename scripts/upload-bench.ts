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

  /** The time it takes to create the base sandbox without storybook */
  createTime: number;
  /** The time it takes to install the base sandbox after it has been initialized */
  generateTime: number;
  /** The time it takes to run `sb init` on the base sandbox */
  initTime: number;
  /** Size of base sandbox node_modules without storybook pre-install */
  createSize: number;
  /** Size of base sandbox node_modules without storybook post-install */
  generateSize: number;
  /** Size of the sandbox node_modules post `sb init` */
  initSize: number;
  /** Difference bewtween `initSize` and `generateSize` */
  diffSize: number;
  /** Full `sb build` time */
  buildTime: number;
  /** Size of the storybook-static directory in total */
  buildSize: number;
  /** Size of the storybook-static/sb-addons in total */
  buildSbAddonsSize: number;
  /** Size of the storybook-static/sb-common-assets */
  buildSbCommonSize: number;
  /** Size of the storybook-static/sb-manager */
  buildSbManagerSize: number;
  /** Size of storybook-static/sb-preview */
  buildSbPreviewSize: number;
  /** Size of the `static` directory if it exists */
  buildStaticSize: number;
  /** Total size of `sb-x` above */
  buildPrebuildSize: number;
  /** Total size of everything else (user's stories & components & CSS & assets etc.) */
  buildPreviewSize: number;
  /** Time to wait-on iframe.html */
  devPreviewResponsive: number;
  /** Time to wait-on index.html */
  devManagerResponsive: number;
  /** Time to browse to index.html and view the SB logo */
  devManagerHeaderVisible: number;
  /** Time to browse to index.html and load the story index */
  devManagerIndexVisible: number;
  /** Time to browse to index.html and load iframe content and the story is rendered */
  devStoryVisible: number;
  /** Time to browse to index.html and load iframe content and the docs page is rendered */
  devDocsVisible: number;
  /** Time to browse to index.html and view the SB logo */
  buildManagerHeaderVisible: number;
  /** Time to browse to index.html and load the story index */
  buildManagerIndexVisible: number;
  /** Time to browse to index.html and load iframe content and the story is rendered */
  buildStoryVisible: number;
  /** Time to browse to index.html and load iframe content and the docs page is rendered */
  buildDocsVisible: number;
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
