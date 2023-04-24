import { CODE_DIRECTORY } from './utils/constants';
import { loadBench } from './bench';
import type { SaveBenchOptions } from './bench';

const uploadBench = async () => {
  const keys = ['build', 'dev', 'bench-build', 'bench-dev'] as SaveBenchOptions['key'][];
  // const data = {} as Record<string, any>;
  await Promise.all(
    keys.map(async (key) => {
      try {
        const val = await loadBench({ key, rootDir: CODE_DIRECTORY });
        console.log({ key, val });
      } catch (err) {
        console.log(`Failed to load bench for the key ${key}:`, err);
      }
    })
  );
};

uploadBench().then(() => {
  console.log('done');
});
