/* eslint-disable @typescript-eslint/ban-ts-ignore */
import * as t from '@babel/types';
import { TraverseOptions, NodePath, Node, Visitor } from '@babel/traverse';
import { Framework } from './framework';

const replace = (p: NodePath<t.Expression>) => {
  if (p.isCallExpression()) {
    const callee = p.get('callee');

    //
    if (callee.isMemberExpression()) {
      const object = callee.get('object');
      const property = callee.get('property') as NodePath<t.Identifier>;

      if (object.isIdentifier() && property.isIdentifier()) {
        if (object.node.name === 'Object' && property.node.name === 'assign') {
          const o = p.get('arguments').find(a => a.isObjectExpression()) as NodePath<
            t.ObjectExpression
          > | null;

          if (o) {
            p.replaceWith(o);
          } else {
            p.replaceWith(t.objectExpression([]));
          }
        }
      }

      return;
    }

    //
    if (callee.isIdentifier()) {
      const targetPath = p.scope.bindings[callee.node.name].path as NodePath<t.Declaration>;

      if (targetPath.isImportSpecifier()) {
        const importDeclaration = targetPath.parentPath as NodePath<t.ImportDeclaration>;

        const source = importDeclaration.get('source').node.value;
        if (source.match(/@storybook/)) {
          const args = p.get('arguments');
          const o = args.find(a => a.isObjectExpression()) as NodePath<t.ObjectExpression> | null;
          const r = args.find(a => a.isIdentifier()) as NodePath<t.Identifier> | null;

          if (o || r) {
            p.replaceWith(o || r);
          } else {
            p.replaceWith(t.objectExpression([]));
          }

          return;
        }
      }
    }

    return;
  }

  //
  if (p.isExpression()) {
    p.replaceWith(t.objectExpression([]));
    return;
  }

  console.log('no bueno signor');
};

export const removeNonMetadata = (framework: Framework): TraverseOptions => ({
  ExportDefaultDeclaration(path) {
    const declaration = path.get('declaration');

    if (declaration.isObjectExpression()) {
      declaration.get('properties').forEach(p1 => {
        if (p1.isObjectProperty() && p1.node.key.name === 'parameters') {
          const value = p1.get('value');
          if (value.isObjectExpression()) {
            const properties = value.get('properties');

            // REMOVE component parameter
            properties.forEach(p2 => {
              if (p2.key === 'component') {
                p2.remove();
              }
            });
          }
        }

        // REMOVE decorators
        if (p1.isObjectProperty() && p1.node.key.name === 'decorators') {
          p1.remove();
        }
      });
    }
  },
  ExpressionStatement(path) {
    const expression = path.get('expression');

    if (expression.isCallExpression()) {
      const callee = expression.get('callee');
      if (callee.isIdentifier() && callee.node.name.match(/(addDecorator|addParameter)/)) {
        path.remove();
      }
    }
  },
  ExportNamedDeclaration(path) {
    const declaration = path.get('declaration') as NodePath<t.Declaration>;
    const specifiers = path.get('specifiers');

    if (declaration.isVariableDeclaration()) {
      declaration.get('declarations').forEach(d => {
        const id = d.get('id');
        const init = d.get('init');

        //
        if (id.isIdentifier()) {
          replace(init);
          return;
        }

        //
        if (id.isObjectPattern()) {
          id.get('properties').forEach((prop, index) => {
            if (
              prop.isObjectProperty() &&
              t.isIdentifier(prop.node.value) &&
              init.isObjectExpression()
            ) {
              const target = init.get('properties')[index];
              if (target.isObjectProperty()) {
                const value = target.get('value');
                if (value.isExpression()) {
                  replace(value);
                }
              }
            } else {
              // unknown if this is bad
            }
          });
          return;
        }

        //
        if (id.isArrayPattern()) {
          id.get('elements').forEach((element, index) => {
            if (element.isIdentifier() && init.isArrayExpression()) {
              const e = init.get('elements')[index];

              if (e.isExpression()) {
                replace(e);
              }
            }
          });
          return;
        }

        //
        throw new Error('unsupported variable declaration');
      });
    } else if (declaration.isFunctionDeclaration()) {
      const id = declaration.node.id.name;

      declaration.replaceWith(
        t.variableDeclaration('const', [
          t.variableDeclarator(t.identifier(id), t.objectExpression([])),
        ])
      );
    } else if (declaration.isClassDeclaration()) {
      const id = declaration.node.id.name;

      declaration.replaceWith(
        t.variableDeclaration('const', [
          t.variableDeclarator(t.identifier(id), t.objectExpression([])),
        ])
      );
    } else if (specifiers.length) {
      specifiers.forEach(i => {
        if (i.isExportSpecifier()) {
          const targetPath = i.scope.bindings[i.node.local.name].path as NodePath<
            t.VariableDeclarator
          >;
          const target = targetPath.get('init');
          replace(target);
        }
      });
    } else {
      try {
        // @ts-ignore
        const id = declaration.node.id.name;

        declaration.replaceWith(
          t.variableDeclaration('const', [
            t.variableDeclarator(t.identifier(id), t.objectExpression([])),
          ])
        );
      } catch (e) {
        declaration.remove();
      }
    }
  },
});
