/* eslint-disable @typescript-eslint/ban-ts-ignore */
import * as t from '@babel/types';
import { NodePath, TraverseOptions } from '@babel/traverse';

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

const parameterKey = 'parameters';
const frameworkKey = 'framework';

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

  // check in comments
  (ast.comments as Comment[]).forEach(i => {
    framework.possibilities.forEach(p => {
      if (i.value.includes(p)) {
        score(p);
      }
    });
  });

  ast.program.body.forEach(i => {
    // check for imports matching known frameworks
    if (t.isImportDeclaration(i)) {
      framework.possibilities.forEach(f => {
        if (i.source.value.includes(f)) {
          score(f);
        }
      });
    }

    // check for default export storyMeta
    if (t.isExportDefaultDeclaration(i)) {
      if (t.isObjectExpression(i.declaration)) {
        const parameters = i.declaration.properties.find(
          p => t.isObjectProperty(p) && p.key.name === parameterKey
        );
        const f = i.declaration.properties.find(
          p => t.isObjectProperty(p) && p.key.name === frameworkKey
        );

        // check for top-level property for framework
        if (f && t.isObjectProperty(f) && t.isStringLiteral(f.value)) {
          win(f.value.value as Framework);
        }

        // check for parameter-level property for framework
        if (t.isObjectProperty(parameters) && t.isObjectExpression(parameters.value)) {
          const frameworkProperty = parameters.value.properties.find(
            p => t.isObjectProperty(p) && p.key.name === frameworkKey
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
  )[0] || [undefined, 0];

  return mostLikelyScore ? (mostLikelyFramework as Framework) : fallback;
};

export const addFrameworkParameter = (framework: Framework): TraverseOptions => ({
  ExportDefaultDeclaration(p) {
    const declaration = p.get('declaration');

    if (declaration.isObjectExpression()) {
      const hasParameter = !!declaration
        .get('properties')
        .find(p1 => p1.isObjectProperty() && p1.node.key.name === parameterKey);

      const hasFramework = !!declaration
        .get('properties')
        .find(p1 => p1.isObjectProperty() && p1.node.key.name === frameworkKey);

      if (!hasFramework) {
        // @ts-ignore
        declaration.pushContainer(
          'properties',
          t.objectProperty(t.identifier(frameworkKey), t.stringLiteral(framework))
        );
      }

      // REMOVE 'parameters.framework' if present
      if (hasParameter) {
        const parameterObject = declaration
          .get('properties')
          .find(p1 => p1.isObjectProperty() && p1.node.key.name === parameterKey);

        if (parameterObject.isObjectProperty()) {
          const value = parameterObject.get('value');
          if (value.isObjectExpression()) {
            const parameterProperties = value.get('properties');
            const found = parameterProperties.find(
              p2 => p2.isObjectProperty() && p2.node.key.name === frameworkKey
            );

            if (found) {
              found.remove();
            }
          }
        }
      }
    }
  },
});
