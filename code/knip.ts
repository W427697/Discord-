import { z } from 'zod';
import type { ConfigurationValidator } from 'knip/dist/configuration-validator';

// TODO: Import this type directly from Knip once it's available (and get rid of zod dependency here)
type Configuration = z.infer<typeof ConfigurationValidator>;

const baseConfig: Configuration = {
  ignore: '**/*.d.ts',
  ignoreBinaries: ['echo'],
  workspaces: {
    'addons/*': {
      entry: ['src/**/{index,manager,preset,preview}.{ts,tsx}'],
      project: 'src/**/*.{ts,tsx}',
    },
    'addons/storyshots-core': {
      entry: ['src/frameworks/*/{loader,renderTree}.ts'],
      project: 'src/**/*.ts',
    },
    'frameworks/*': {
      entry: [
        'src/{index,preset,preview}.{ts,tsx}',
        'src/builders/{build,start}-storybook/index.ts',
        'src/**/docs/{index,config}.{js,ts}',
      ],
      project: 'src/**/*.{js,jsx,ts,tsx}',
      ignore: ['**/__mocks-ng-workspace__', '**/__testfixtures__'],
    },
    'lib/*': {
      entry: ['src/{index,entry,runtime}.ts'],
      project: 'src/**/*.ts',
    },
    'lib/builder-webpack5': {
      entry: ['src/index.ts', 'src/presets/*.ts'],
      project: 'src/**/*.ts',
    },
    'lib/cli': {
      entry: ['src/generate.ts'],
      project: 'src/**/*.ts',
    },
    'ui/manager': {
      entry: [
        'scripts/generate-exports-file.ts',
        'src/index.tsx',
        'src/globals.ts',
        'src/runtime.ts',
      ],
      project: '{scripts,src}/**/*.{js,ts,tsx}',
    },
  },
};

export default baseConfig;
