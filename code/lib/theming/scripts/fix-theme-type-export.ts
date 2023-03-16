/* eslint-disable no-console */
import { readFile, writeFile } from 'fs-extra';
import { dedent } from 'ts-dedent';
import { join } from 'path';

const EXTENSION_REGEX = /(from '.*)\.js';/g;

const run = async () => {
  const target = join(process.cwd(), 'dist', 'index.d.ts');
  let contents = await readFile(target, 'utf8');

  const footer = contents.includes('// devmode')
    ? `export { StorybookTheme as Theme } from '../src/index';`
    : dedent`
        interface Theme extends StorybookTheme {}
        export type { Theme };
      `;

  contents = contents.replace(EXTENSION_REGEX, `$1';`);
  contents = dedent`
    ${contents}
    ${footer}
  `;

  await writeFile(target, contents);
};

run().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
