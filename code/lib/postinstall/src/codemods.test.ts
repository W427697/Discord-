import path from 'path';
import fs from 'fs';
import 'jest-specific-snapshot';
import { applyAsyncTransform } from './applyAsyncTransform';

jest.mock('@storybook/node-logger');

const inputRegExp = /\.input\.js$/;

const fixturesDir = path.resolve(__dirname, './__testfixtures__');
fs.readdirSync(fixturesDir).forEach((transformName) => {
  const transformFixturesDir = path.join(fixturesDir, transformName);
  describe(`${transformName}`, () => {
    fs.readdirSync(transformFixturesDir)
      .filter((fileName) => inputRegExp.test(fileName))
      .forEach((fileName) => {
        const inputPath = path.join(transformFixturesDir, fileName);
        it(`transforms correctly using "${fileName}" data`, async () =>
          expect(
            applyAsyncTransform(
              // eslint-disable-next-line global-require,import/no-dynamic-require
              require(path.join(__dirname, '__testtransforms__', transformName)),
              null,
              { path: inputPath, source: fs.readFileSync(inputPath, 'utf8') }
            )
          ).resolves.toMatchSpecificSnapshot(inputPath.replace(inputRegExp, '.output.snapshot')));
      });
  });
});
