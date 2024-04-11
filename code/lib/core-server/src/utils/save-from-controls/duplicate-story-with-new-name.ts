/* eslint-disable no-underscore-dangle */
import type { CsfFile } from '@storybook/csf-tools';
import * as traverse from '@babel/traverse';
import * as t from '@babel/types';

type In = ReturnType<CsfFile['parse']>;

export const duplicateStoryWithNewName = (csfFile: In, storyName: string, newStoryName: string) => {
  const node = csfFile._storyExports[storyName];
  const cloned = t.cloneNode(node) as t.VariableDeclarator;

  let found = false;
  traverse.default(cloned, {
    Identifier(path) {
      if (found) {
        return;
      }

      if (path.node.name === storyName) {
        found = true;
        path.node.name = newStoryName;
      }
    },
    ObjectProperty(path) {
      const key = path.get('key');
      if (key.isIdentifier() && key.node.name === 'args') {
        path.remove();
      }
    },

    noScope: true,
  });

  traverse.default(csfFile._ast, {
    Program(path) {
      path.pushContainer(
        'body',
        t.exportNamedDeclaration(t.variableDeclaration('const', [cloned]))
      );
    },
  });

  return cloned;
};
