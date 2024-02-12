/* eslint-disable no-underscore-dangle */
import type { FileInfo } from 'jscodeshift';
import { loadCsf } from '@storybook/csf-tools';
import type { BabelFile } from '@babel/core';
import * as babel from '@babel/core';

function findImplicitSpies(path: babel.NodePath, file: string) {
  path.traverse({
    Identifier: (identifier) => {
      if (/^on[A-Z].*/.test(identifier.node.name)) {
        console.warn(identifier.buildCodeFrameError(`${file} Possible implicit spy found`).message);
      }
    },
  });
}

export default async function transform(info: FileInfo) {
  const csf = loadCsf(info.source, { makeTitle: (title) => title });
  const fileNode = csf._ast;
  // @ts-expect-error File is not yet exposed, see https://github.com/babel/babel/issues/11350#issuecomment-644118606
  const file: BabelFile = new babel.File(
    { filename: info.path },
    { code: info.source, ast: fileNode }
  );

  file.path.traverse({
    // CSF2 play function Story.play =
    AssignmentExpression: (path) => {
      const left = path.get('left');
      if (!left.isMemberExpression()) return;

      const property = left.get('property');
      if (property.isIdentifier() && property.node.name === 'play') {
        findImplicitSpies(path, info.path);
      }
    },

    // CSF3 play function: const Story = {play: () => {} };
    ObjectProperty: (path) => {
      const key = path.get('key');
      if (key.isIdentifier() && key.node.name === 'play') {
        findImplicitSpies(path, info.path);
      }
    },
  });

  return;
}

export const parser = 'tsx';
