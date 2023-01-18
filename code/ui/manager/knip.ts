import { addBundlerEntries } from '../../knip';
import type { KnipConfig } from 'knip';

const baseConfig: KnipConfig = {
  entry: ['scripts/generate-exports-file.ts'],
  project: '{scripts,src}/**/*.{js,ts,tsx}',
};

export default addBundlerEntries(baseConfig);
