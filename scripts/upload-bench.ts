import { loadBench } from './bench';
import type { SaveBenchOptions } from './bench';

const uploadBench = async () => {
  const keys = ['build', 'dev', 'bench-build', 'bench-dev'] as SaveBenchOptions['key'][];
  // const data = {} as Record<string, any>;
  await Promise.all(
    keys.map(async (key) => {
      const val = await loadBench({ key, rootDir: '../code' });
      console.log({ key, val });
    })
  );
};

uploadBench().then(() => {
  console.log('done');
});
