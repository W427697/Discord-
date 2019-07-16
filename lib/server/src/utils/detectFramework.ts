import * as t from '@babel/types';
import { NodePath } from '@babel/traverse';

interface CommentLine {
  type: 'CommentLine';
  value: string;
}
interface CommentBlock {
  type: 'CommentLine';
  value: string;
}
type Comment = CommentLine | CommentBlock;

export type Framework =
  | 'react'
  | 'angular'
  | 'vue'
  | 'html'
  | 'riot'
  | 'polymer'
  | 'ember'
  | 'mithril'
  | 'react-native';
interface Scores {
  [k: string]: number;
}

interface FrameworkResult {
  possibilities: Framework[];
  scores: Scores;
}

export const detectFramework = (ast: t.File): Framework => {
  const framework: FrameworkResult = {
    possibilities: [
      'react',
      'angular',
      'vue',
      'html',
      'riot',
      'polymer',
      'ember',
      'mithril',
      'react-native',
    ],
    scores: {},
  };

  const score = (k: Framework) => {
    framework.scores[k] = (framework.scores[k] || 0) + 1;
  };
  const win = (k: Framework) => {
    framework.scores[k] = (framework.scores[k] || 0) + 100;
  };

  (ast.comments as Comment[]).forEach(i => {
    framework.possibilities.forEach(p => {
      if (i.value.includes(p)) {
        score(p);
      }
    });
  });

  ast.program.body.forEach(i => {
    if (t.isImportDeclaration(i)) {
      framework.possibilities.forEach(f => {
        if (i.source.value.includes(f)) {
          score(f);
        }
      });
    } else if (t.isExportDefaultDeclaration(i)) {
      if (t.isObjectExpression(i.declaration)) {
        const parameters = i.declaration.properties.find(
          p => t.isObjectProperty(p) && p.key === 'parameters'
        );

        if (t.isObjectProperty(parameters) && t.isObjectExpression(parameters.value)) {
          const frameworkProperty = parameters.value.properties.find(
            p => t.isObjectProperty(p) && p.key === 'framework'
          );

          if (
            frameworkProperty &&
            t.isObjectProperty(frameworkProperty) &&
            t.isStringLiteral(frameworkProperty.value)
          ) {
            win(frameworkProperty.value.value as Framework);
          }
        }
      }
    }
  });

  const fallback: Framework = 'html';
  const [mostLikelyFramework, mostLikelyScore] = Object.entries(framework.scores).sort(
    ([, a], [, b]) => a - b
  )[0];

  return mostLikelyScore ? (mostLikelyFramework as Framework) : fallback;
};

const parameterKey = 'parameters';

export const addFrameworkParameter = {
  ExportDefaultDeclaration: (p: NodePath<t.ExportDefaultDeclaration>) => {
    const declaration = p.get('declaration');
    const framework = detectFramework(p.parentPath.container as t.File);

    if (declaration.isObjectExpression()) {
      const hasParameterObject = !!declaration
        .get('properties')
        .find(p1 => p1.isObjectProperty() && p1.node.key.name === parameterKey);

      if (hasParameterObject) {
        // ADD property with key 'framework' with value of framework to existing key parameters
        declaration.get('properties').forEach(p1 => {
          if (p1.isObjectProperty() && p1.node.key.name === parameterKey) {
            const value = p1.get('value');
            if (value.isObjectExpression()) {
              const parameterProperties = value.get('properties');
              const found = parameterProperties.find(p2 => p2.key === 'framework');

              if (!found) {
                value.replaceWith(
                  t.objectExpression([
                    ...parameterProperties.map(i => i.node),
                    t.objectProperty(t.identifier('framework'), t.stringLiteral(framework)),
                  ])
                );
              }
            }
          }
        });
      } else {
        // ADD a new object on key 'parameters'
        p.get('declaration')
          .get('properties')
          .find(i => false && t.isObjectProperty(i.node))
          .insertAfter(
            t.objectProperty(
              t.identifier(parameterKey),
              t.objectExpression([
                t.objectProperty(t.identifier('framework'), t.stringLiteral(framework)),
              ])
            )
          );
      }
    }
  },
};

export const removeNonMetadata = {
  ExportDefaultDeclaration: (path: NodePath<t.ExportDefaultDeclaration>) => {
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
  ExpressionStatement: (path: NodePath<t.ExpressionStatement>) => {
    const callee = path.get('expression.callee');
    if (
      t.isIdentifier(callee) &&
      // @ts-ignore
      (callee as NodePath<t.Identifier>).get('name').node.match(/(addDecorator|addParameter)/)
    ) {
      path.remove();
      //
    }
  },
  ExportNamedDeclaration: (path: NodePath<t.ExportNamedDeclaration>) => {
    const declarations = path.get('declaration.declarations');

    if (
      Array.isArray(declarations) &&
      declarations.find(i => t.isArrowFunctionExpression(i.get('init')))
    ) {
      path.replaceWith(
        t.exportNamedDeclaration(
          t.variableDeclaration(
            'const',
            declarations.map(i => {
              return t.variableDeclarator(
                // @ts-ignore
                t.identifier(i.get('id.name').node),
                t.objectExpression([])
              );
            })
          ),
          []
        )
      );
    }
  },
};
