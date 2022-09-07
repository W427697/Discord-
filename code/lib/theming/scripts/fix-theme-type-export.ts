/* eslint-disable no-console */
import { readFile, writeFile } from 'fs-extra';
import { dedent } from 'ts-dedent';
import { join } from 'path';

async function editIndexTypeDefinitionsFile() {
  const target = join(process.cwd(), 'dist', 'index.d.ts');
  const contents = await readFile(target, 'utf8');

  const footer = contents.includes('// devmode')
    ? `export { StorybookTheme as Theme } from '../src/index';`
    : dedent`
        interface Theme extends StorybookTheme {}
        export type { Theme };
      `;

  const newContents = dedent`
    ${contents}
    ${footer}
  `;

  await writeFile(target, newContents);
}

async function editIndexESMFile() {
  const target = join(process.cwd(), 'dist', 'index.mjs');
  const contents = await readFile(target, 'utf8');

  const newContents = contents.replace(/\.useInsertionEffect/g, `['useInsertion'+'Effect']`);

  await writeFile(target, newContents);
}

const run = async () => {
  await editIndexTypeDefinitionsFile();
  await editIndexESMFile();
};

run().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
