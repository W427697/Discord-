import { copy } from 'fs-extra';
import { join } from 'path';
import { loadBench } from './bench';
import type { SaveBenchOptions } from './bench';
import { SANDBOX_DIRECTORY, CODE_DIRECTORY } from './utils/constants';

const templateKey = process.argv[2];

const sandboxDir = process.env.SANDBOX_ROOT || SANDBOX_DIRECTORY;
const templateSandboxDir = templateKey && join(sandboxDir, templateKey.replace('/', '-'));

const uploadBench = async () => {
  const keys = ['build', 'dev', 'bench-build', 'bench-dev'] as SaveBenchOptions['key'][];
  // const data = {} as Record<string, any>;
  await Promise.all(
    keys.map(async (key) => {
      try {
        const val = await loadBench({ key, rootDir: templateSandboxDir });
        console.log({ key, val });
      } catch (err) {
        console.log(`Failed to load bench for the key ${key}:`, err);
      }
    })
  );

  await copy(`${templateSandboxDir}/bench-results`, `${CODE_DIRECTORY}/bench-results`);
};

uploadBench().then(() => {
  console.log('done');
});
