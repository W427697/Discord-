import { z } from 'zod';
import type { ConfigurationValidator } from 'knip/dist/configuration-validator';
import { addBundlerEntries } from '../../knip';

// TODO: Import this type directly from Knip once it's available (and get rid of zod dependency here)
type Configuration = z.infer<typeof ConfigurationValidator>;

const baseConfig: Configuration = {
  entry: ['scripts/generate-exports-file.ts'],
  project: '{scripts,src}/**/*.{js,ts,tsx}',
};

export default addBundlerEntries(baseConfig);
