import { join } from 'node:path';
import { process, dts, nodeInternals } from '../../../scripts/prepare/tools';
import { getEntries } from './entries';
import pkg from '../package.json';
import { flattenDependencies } from './helpers/dependencies';

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
];
const internal = [
  ...new Set(await flattenDependencies([...Object.keys(pkg.devDependencies)], [], external)),
];

const all = entries.filter((e) => e.dts);
const list = selection === 'all' ? all : [all[Number(selection)]];

console.log(list);

const dtsResults = dts.generateDtsBundle(
  list.map(({ file, externals }) => {
    const inlined = internal.filter((i) => ![...external, ...externals].includes(i));
    // .filter((i) => !i.startsWith('@types'));

    // console.log({ inlined });
    return {
      filePath: file,
      noCheck: true,
      libraries: {
        importedLibraries: [...external, ...externals],
        // allowedTypesLibraries: [...external, ...externals],
        inlinedLibraries: inlined,
      },
      output: { noBanner: true, exportReferencedTypes: false },
    };
  }),
  { preferredConfigPath: join(cwd, 'tsconfig.build.json') }
);
await Promise.all(
  dtsResults.map(async (content, index) => {
    return Bun.write(list[index].file.replace('src', 'dist').replace('.ts', '.d.ts'), content);
  })
);
