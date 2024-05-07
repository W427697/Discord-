import { join } from 'node:path';
import { process, genDtsBundle, nodeInternals } from '../../../scripts/prepare/tools';
import { getEntries } from './entries';
import pkg from '../package.json';

const cwd = process.cwd();

const flags = process.argv.slice(2);

const selection = flags[0] || 'all';

const entries = getEntries(cwd);
const external = [
  ...Object.keys((pkg as any).dependencies || {}),
  ...Object.keys((pkg as any).peerDependencies || {}),
  ...nodeInternals,
  'typescript',
  '@storybook/core',
  '@storybook/core/dist/channels',
  '@storybook/core/dist/router',
  '@storybook/core/dist/preview-api',
  '@storybook/core/dist/client-logger',
  '@storybook/core/dist/types',
];

const all = entries.filter((e) => e.dts);
const list = selection === 'all' ? all : [all[Number(selection)]];

await Promise.all(
  list.map(async (i) => {
    await genDtsBundle(
      i.file,
      [...external, ...i.externals],
      join(import.meta.dirname, '..', 'tsconfig.build.json')
    );
  })
);
