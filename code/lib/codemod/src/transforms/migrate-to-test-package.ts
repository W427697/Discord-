/* eslint-disable no-underscore-dangle */
import type { FileInfo } from 'jscodeshift';
import { loadCsf, printCsf } from '@storybook/csf-tools';
import type { BabelFile } from '@babel/core';
import * as babel from '@babel/core';
import * as t from '@babel/types';

export default function transform(info: FileInfo): string {
  const csf = loadCsf(info.source, { makeTitle: (title) => title });
  const fileNode = csf._ast;
  // @ts-expect-error File is not yet exposed, see https://github.com/babel/babel/issues/11350#issuecomment-644118606
  const file: BabelFile = new babel.File(
    { filename: info.path },
    { code: info.source, ast: fileNode }
  );

  file.path.traverse({
    ImportDeclaration: (path) => {
      if (
        path.node.source.value === '@storybook/jest' ||
        path.node.source.value === '@storybook/testing-library'
      ) {
        if (path.node.source.value === '@storybook/jest') {
          path.get('specifiers').forEach((specifier) => {
            if (specifier.isImportSpecifier()) {
              const imported = specifier.get('imported');
              if (!imported.isIdentifier()) return;
              if (imported.node.name === 'jest') {
                specifier.remove();
                path.node.specifiers.push(t.importNamespaceSpecifier(t.identifier('jest')));
              }
            }
          });
        }
        path.get('source').replaceWith(t.stringLiteral('@storybook/test'));
      }
    },
    Identifier: (path) => {
      console.log(path.node.name);
      if (path.node.name === 'jest') {
        path.replaceWith(t.identifier('test'));
      }
    },
  });

  return printCsf(csf).code;
}

export const parser = 'tsx';
