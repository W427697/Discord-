import { handleADD, patchNode } from './parse-helpers';

const estraverse = require('estraverse');

export function findAddsMap(ast) {
  const adds = {};

  estraverse.traverse(ast, {
    fallback: 'iteration',
    enter: (node, parent) => {
      patchNode(node);

      if (node.type === 'MemberExpression') {
        handleADD(node, parent, adds);
      }
    },
  });

  return adds;
}
