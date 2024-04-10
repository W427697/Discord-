import * as t from '@babel/types';
import * as traverse from '@babel/traverse';
import { astify } from './astify';

export const updateArgsInCsfFile = async (node: t.Node, input: Record<string, any>) => {
  let found = false;
  const args = Object.fromEntries(
    Object.entries(input).map(([k, v]) => {
      return [k, astify(v)];
    })
  );

  traverse.default(node, {
    ObjectExpression(path) {
      if (found) {
        return;
      }

      found = true;
      const properties = path.get('properties');
      const argsProperty = properties.find((property) => {
        if (property.isObjectProperty()) {
          const key = property.get('key');
          return key.isIdentifier() && key.node.name === 'args';
        }
        return false;
      });

      if (argsProperty) {
        const v = argsProperty.get('value');
        if (t.isObjectExpression(v)) {
          argsProperty.replaceWith(
            t.objectProperty(
              t.identifier('args'),
              t.objectExpression(
                Object.entries(args).map(([key, value]) =>
                  t.objectProperty(t.identifier(key), value)
                )
              )
            )
          );
        }
      } else {
        path.pushContainer(
          'properties',
          t.objectProperty(
            t.identifier('args'),
            t.objectExpression(
              Object.entries(args).map(([key, value]) => t.objectProperty(t.identifier(key), value))
            )
          )
        );
      }
    },

    noScope: true,
  });
};
