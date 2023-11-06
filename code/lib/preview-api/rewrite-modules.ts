/// <reference types="node" />

// rewrite code from dist that triggers this bug: https://github.com/vercel/next.js/issues/57962
import { join, relative } from 'path';
import { cwd } from 'process';
import { promises } from 'fs';

const DIST = relative(cwd(), './dist');

async function go() {
  const filenames = await promises.readdir(DIST);

  await Promise.all(
    filenames.map(async (filename) => {
      if (filename.endsWith('.mjs')) {
        const fullFilename = join(DIST, filename);

        const content = await promises.readFile(fullFilename, 'utf-8');

        const newContent = content
          .replace(/\(exports, module\)/g, '(exports, mod)')
          .replace(/module.exports = /g, 'mod.exports = ');

        await promises.writeFile(fullFilename, newContent);
      }
    })
  );
}

go();
