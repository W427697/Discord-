import path from 'node:path';
import { parseArgs } from 'node:util';
import { z } from 'zod';
import { isMatch } from 'picomatch';
import type { ConfigurationValidator } from 'knip/dist/configuration-validator';

// TODO: Import this type directly from Knip once it's available (and get rid of zod dependency here)
type Configuration = z.infer<typeof ConfigurationValidator>;

const baseDir = process.cwd();
const { values } = parseArgs({ strict: false, options: { workspace: { type: 'string' } } });
const wsArg = values.workspace;

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
        'src/builders/{build,start}-storybook/index.ts',
        'src/**/docs/{index,config}.{js,ts}',
      ],
      project: 'src/**/*.{js,jsx,ts,tsx}',
      ignore: ['**/__mocks-ng-workspace__', '**/__testfixtures__'],
    },
    'lib/*': {
      entry: [],
      project: 'src/**/*.ts',
    },
    'lib/builder-webpack5': {
      entry: [],
      project: 'src/**/*.ts',
    },
    'lib/cli': {
      entry: [],
      project: 'src/**/*.ts',
    },
    'ui/manager': {
      entry: ['scripts/generate-exports-file.ts'],
      project: '{scripts,src}/**/*.{js,ts,tsx}',
    },
  },
};

// Adds package.json#bundler.entries to each workspace config `entry: []`
export const addBundlerEntries = async (config: Configuration) => {
  const wsKeys = config.workspaces ? Object.keys(config.workspaces) : ['.'];
  const wsMatches = wsArg ? wsKeys.filter((wsKey) => isMatch(wsArg, wsKey)) : wsKeys;
  wsMatches.forEach((wsKey) => {
    const wsDir = !wsKey.includes('*') ? wsKey : wsArg && isMatch(wsArg, wsKey) ? wsArg : null;
    if (wsDir) {
      // Explicitly no try/catch here to require package.json
      const manifest = require(path.join(baseDir, wsDir, 'package.json'));
      const configEntries = config.workspaces ? config.workspaces[wsKey].entry : config.entry;
      const bundlerEntries = manifest?.bundler?.entries;
      if (Array.isArray(configEntries) && Array.isArray(bundlerEntries)) {
        configEntries.push(...manifest.bundler.entries);
      }
    }
  });
  return config;
};

export default addBundlerEntries(baseConfig);
