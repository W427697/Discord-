import { join } from 'node:path';
import { process, dts, nodeInternals } from '../../../scripts/prepare/tools';
import { getEntries } from './entries';
import pkg from '../package.json';

const cwd = process.cwd();

const flags = process.argv.slice(2);

const selection = flags[0] || 'all';

const entries = getEntries(cwd);
const external = [...Object.keys((pkg as any).peerDependencies || {}), ...nodeInternals];
const internal = [...Object.keys(pkg.devDependencies)];

const all = entries.filter((e) => e.dts);
const list = selection === 'all' ? all : [all[Number(selection)]];

const dtsResults = dts.generateDtsBundle(
  list.map(({ file, externals }) => ({
    filePath: file,
    noCheck: true,
    libraries: {
      importedLibraries: [...external, ...externals],
      allowedTypesLibraries: [...externals],
      inlinedLibraries: internal,
    },
    output: { noBanner: true, exportReferencedTypes: false },
  })),
  { preferredConfigPath: join(cwd, 'tsconfig.build.json') }
);
await Promise.all(
  dtsResults.map(async (content, index) => {
    return Bun.write(list[index].file.replace('src', 'dist').replace('.ts', '.d.ts'), content);
  })
);
