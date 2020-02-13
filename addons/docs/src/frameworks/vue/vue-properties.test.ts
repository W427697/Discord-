import 'jest-specific-snapshot';
import path from 'path';
import fs from 'fs';
import Memoryfs from 'memory-fs';
import VueLoaderPlugin from 'vue-loader/lib/plugin';
import webpack from 'webpack';

import { transformFileSync, transformSync } from '@babel/core';
import requireFromString from 'require-from-string';

import { extractProps } from './extractProps';

// File hierarchy:
// __testfixtures__ / some-test-case / input.*
const inputRegExp = /^input\..*$/;

const transformToModule = (inputCode: string) => {
  const options = {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            esmodules: true,
          },
        },
      ],
    ],
  };
  const { code } = transformSync(inputCode, options);
  return normalizeNewlines(code);
};

const annotateWithDocgen = (inputPath: string) => {
  const options = {};
  const compiler = webpack({
    context: __dirname,
    entry: inputPath,
    output: {
      path: path.resolve(__dirname),
      filename: 'bundle.js',
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          use: [{ loader: 'vue-loader' }],
        },
        {
          test: /\.vue$/,
          enforce: 'post',
          loader: 'vue-docgen-loader',
          options,
        },
        {
          test: /\.vue.js$/,
          enforce: 'post',
          loader: 'vue-docgen-loader',
          options,
        },
      ],
    },
    plugins: [new VueLoaderPlugin()],
  });

  compiler.outputFileSystem = new Memoryfs();

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        return reject(err);
      }

      if (stats.hasErrors()) {
        return reject(new Error(stats.toJson().errors.join(',')));
      }

      return resolve(stats);
    });
  });
};

const normalizeNewlines = (string: string) => string.replace(/\\r\\n/g, '\\n');

describe('react component properties', () => {
  const fixturesDir = path.join(__dirname, '__testfixtures__');
  fs.readdirSync(fixturesDir, { withFileTypes: true }).forEach(testEntry => {
    if (testEntry.isDirectory()) {
      const testDir = path.join(fixturesDir, testEntry.name);
      const testFile = fs.readdirSync(testDir).find(fileName => inputRegExp.test(fileName));
      if (testFile) {
        it(testEntry.name, async () => {
          const inputPath = path.join(testDir, testFile);

          // snapshot the output of babel-plugin-react-docgen
          const docgenPretty = (await annotateWithDocgen(inputPath)) as string;
          expect(docgenPretty).toMatchSpecificSnapshot(path.join(testDir, 'docgen.snapshot'));

          // transform into an uglier format that's works with require-from-string
          const docgenModule = transformToModule(docgenPretty);

          // snapshot the output of component-properties/react
          const { component } = requireFromString(docgenModule);
          const properties = extractProps(component);
          expect(properties).toMatchSpecificSnapshot(path.join(testDir, 'properties.snapshot'));
        });
      }
    }
  });
});
