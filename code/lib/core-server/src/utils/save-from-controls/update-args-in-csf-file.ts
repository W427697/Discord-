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
        if (argsProperty.isObjectProperty()) {
          // for each key in input, try to find the key in argsProperty>value>entries when found, replace the value with the new value
          const a = argsProperty.get('value');
          if (a.isObjectExpression()) {
            a.traverse({
              ObjectProperty(p) {
                const key = p.get('key');
                if (key.isIdentifier() && key.node.name in args) {
                  p.get('value').replaceWith(args[key.node.name]);
                  delete args[key.node.name];
                }
              },
            });

            const remainder = Object.entries(args);
            if (Object.keys(args).length) {
              remainder.forEach(([key, value]) => {
                a.pushContainer('properties', t.objectProperty(t.identifier(key), value));
              });
            }
          }
        }
      } else {
        path.unshiftContainer(
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
