import { transformFileAsync } from '@babel/core';
import { TraverseOptions } from '@babel/traverse';
import { parse } from '@babel/parser';
import { format } from 'prettier';
import fse from 'fs-extra';

import snapshotDiff from 'snapshot-diff';

export const diff = (a: string, b: string) =>
  snapshotDiff(a, b, {
    stablePatchmarks: true,
    aAnnotation: 'Removed',
    bAnnotation: 'Added',
  }).replace('Snapshot Diff', 'Transforms');

const prettierConfig = require('../../../../prettier.config');

export const createExample = async (type: string) => {
  return createFile(require.resolve(`../__mocks__/${type}`));
};

export const createFile = async (file: string) => {
  return {
    file,
    code: formatCode(await fse.readFile(file, 'utf8')),
  };
};

export const formatCode = (code: string) => format(code, { ...prettierConfig, parser: 'babel' });

export const createTestPlugin = (visitor: TraverseOptions) => {
  return function testPlugin() {
    return {
      visitor,
    };
  };
};

export const transform = async (example: string, visitor: TraverseOptions = {}) =>
  transformFileAsync(example, {
    configFile: false,
    sourceMaps: true,
    retainLines: true,
    compact: false,
    plugins: [createTestPlugin(visitor)],
  }).then(({ code, ast, map }) => ({
    code,
    // added to make it easier to assert code changes
    formattedCode: formatCode(code),
    ast,
    map,
  }));

export const createAST = (source: string) => {
  return parse(source, {
    sourceType: 'module',
    plugins: ['typescript', 'dynamicImport', 'jsx'],
  });
};
