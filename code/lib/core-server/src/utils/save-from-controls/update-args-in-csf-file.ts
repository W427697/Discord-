import type * as t from '@babel/types';
import * as traverse from '@babel/traverse';

export const updateArgsInCsfFile = async (node: t.Node, args: Record<string, any>) => {
  traverse.default(node, {
    ObjectExpression(path) {
      const properties = path.get('properties');
      properties.forEach((property) => {
        if (property.isObjectProperty()) {
          const key = property.get('key');
          if (key.isIdentifier() && key.node.name === 'args') {
            const value = property.get('value');
            if (value.isObjectExpression()) {
              args = {
                ...args,
                ...value.node.properties.reduce((acc, prop) => {
                  if (prop.type === 'ObjectProperty') {
                    const k = prop.key;
                    if (k.type === 'Identifier') {
                      acc[k.name] = prop.value;
                    }
                  }
                  return acc;
                }, {}),
              };
            }
          }
        }
      });
    },
  });
};
