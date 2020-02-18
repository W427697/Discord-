/* eslint-disable @typescript-eslint/ban-ts-ignore */
import * as t from '@babel/types';
import { TraverseOptions, NodePath } from '@babel/traverse';
import { Framework } from './framework';

const parameterKey = 'parameters';

interface Bindings {
  storyMeta?: t.Identifier;
  add?: t.Identifier;
}

interface ExportedValues {
  [key: string]: NodePath<t.Expression>;
}

export const addRuntime = (framework: Framework): TraverseOptions => {
  const exportedValues: ExportedValues = {};
  const bindings: Bindings = {};

  const inject = (key: string, value: NodePath<t.Expression>) => {
    exportedValues[key] = value;
  };

  return {
    ExportDefaultDeclaration(path) {
      const declaration = path.get('declaration');

      if (declaration.isObjectExpression()) {
        path.scope.push({ id: bindings.storyMeta, init: declaration.node, kind: 'const' });
        path.replaceWith(t.exportDefaultDeclaration(bindings.storyMeta));
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
            const key = id.node.name;
            const value = init;

            inject(key, value);
            return;
          }

          //
          if (id.isObjectPattern()) {
            id.get('properties').forEach((prop, index) => {
              if (
                prop.isObjectProperty() &&
                t.isIdentifier(prop.node.key) &&
                init.isObjectExpression()
              ) {
                const target = init.get('properties')[index];
                if (target.isObjectProperty()) {
                  const value = target.get('value');
                  const key = prop.node.key.name;
                  if (value.isExpression()) {
                    inject(key, value);
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
            const elements = id.get('elements');

            elements.forEach((element, index) => {
              if (element.isIdentifier() && init.isArrayExpression()) {
                const value = init.get('elements')[index];
                const key = element.node.name;

                if (value.isExpression()) {
                  inject(key, value);
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
            const key = i.node.local.name;
            const targetPath = i.scope.bindings[key].path as NodePath<t.VariableDeclarator>;
            const target = targetPath.get('init');
            inject(key, target);
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
          // eslint-disable-next-line no-console
          console.log('REMOVE DECLARATION');
          declaration.remove();
        }
      }
    },

    Program: {
      enter(path) {
        bindings.add = path.scope.generateUidIdentifier('add');
        bindings.storyMeta = path.scope.generateUidIdentifier('storyMeta');
      },
      exit(path) {
        const hasStoryMeta = path.scope.bindings[bindings.storyMeta.name];

        // @ts-ignore
        path.unshiftContainer('body', [
          t.importDeclaration(
            [t.importSpecifier(bindings.add, t.identifier('add'))],
            t.stringLiteral('@storybook/runtime')
          ),
        ]);
        // @ts-ignore
        path.pushContainer('body', [
          t.expressionStatement(
            t.callExpression(bindings.add, [
              t.stringLiteral(framework),
              t.objectExpression(
                []
                  .concat([
                    t.objectProperty(t.identifier('module'), t.identifier('module'), false, true),
                    t.objectProperty(
                      t.identifier('stories'),
                      t.objectExpression(
                        Object.keys(exportedValues).map(key => {
                          return t.objectProperty(
                            t.identifier(key),
                            t.identifier(key),
                            false,
                            true
                          );
                        })
                      )
                    ),
                  ])
                  .concat(hasStoryMeta ? t.spreadElement(bindings.storyMeta) : [])
              ),
            ])
          ),
        ]);
      },
    },
  };
};
