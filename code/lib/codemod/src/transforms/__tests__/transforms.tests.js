import { describe, it, expect, vi } from 'vitest';
import { join } from 'node:path';
import { readdirSync, readFileSync } from 'node:fs';
import { applyTransform } from 'jscodeshift/dist/testUtils';

vi.mock('@storybook/node-logger');

const inputRegExp = /\.input\.js$/;

const fixturesDir = resolve(__dirname, '../__testfixtures__');
readdirSync(fixturesDir).forEach((transformName) => {
  // FIXME: delete after https://github.com/storybookjs/storybook/issues/19497
  if (transformName === 'mdx-to-csf') return;

  const transformFixturesDir = join(fixturesDir, transformName);
  describe(`${transformName}`, () => {
    readdirSync(transformFixturesDir)
      .filter((fileName) => inputRegExp.test(fileName))
      .forEach((fileName) => {
        const inputPath = join(transformFixturesDir, fileName);
        it(`transforms correctly using "${fileName}" data`, () =>
          expect(
            applyTransform(require(join(__dirname, '..', transformName)), null, {
              path: inputPath,
              source: readFileSync(inputPath, 'utf8'),
            })
          ).toMatchFileSnapshot(inputPath.replace(inputRegExp, '.output.snapshot')));
      });
  });
});
