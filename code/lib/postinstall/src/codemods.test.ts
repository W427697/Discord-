import { describe, it, expect } from 'vitest';
import { join } from 'path';
import { readFile } from 'fs/promises';
import { readdirSync } from 'fs';
// @ts-expect-error (broken types)
import { applyTransform } from 'jscodeshift/dist/testUtils';

const inputRegExp = /\.input\.js$/;

const ROOT = __dirname;
const fixturesDir = join(ROOT, '__testfixtures__');
const fixturesDirectories = readdirSync(fixturesDir);

fixturesDirectories.forEach((transformName) => {
  const transformFixturesDir = join(fixturesDir, transformName);

  describe(`${transformName}`, () => {
    const files = readdirSync(transformFixturesDir);

    files
      .filter((fileName) => inputRegExp.test(fileName))
      .forEach((fileName) => {
        it(`transforms correctly using "${fileName}" data`, async () => {
          const pathToInput = join(transformFixturesDir, fileName);
          const pathToOutput = pathToInput.replace(inputRegExp, '.output.snapshot');
          const pathToTransformer = join(ROOT, '__testtransforms__', transformName);

          const { default: transformer } = await import(pathToTransformer);
          const source = await readFile(pathToInput, 'utf8');

          expect(
            applyTransform(transformer, null, {
              path: pathToInput,
              source,
            })
          ).toMatchFileSnapshot(pathToOutput);
        });
      });
  });
});
