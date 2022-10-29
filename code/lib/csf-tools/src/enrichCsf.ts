/* eslint-disable no-underscore-dangle */
import * as t from '@babel/types';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as generate from '@babel/generator';
import type { CsfFile } from './CsfFile';

export const enrichCsf = (csf: CsfFile) => {
  Object.keys(csf._storyExports).forEach((key) => {
    const storyExport = csf.getStoryExport(key);
    const source = extractSource(storyExport);
    const description = extractDescription(csf._storyStatements[key]);
    const parameters = [];
    // storySource: { source: %%source%% },
    parameters.push(
      t.objectProperty(
        t.identifier('storySource'),
        t.objectExpression([t.objectProperty(t.identifier('source'), t.stringLiteral(source))])
      )
    );
    // docs: { description: { story: %%description%% } },
    if (description) {
      parameters.push(
        t.objectProperty(
          t.identifier('docs'),
          t.objectExpression([
            t.objectProperty(
              t.identifier('description'),
              t.objectExpression([
                t.objectProperty(t.identifier('story'), t.stringLiteral(description)),
              ])
            ),
          ])
        )
      );
    }
    const originalParameters = t.memberExpression(t.identifier(key), t.identifier('parameters'));
    parameters.push(t.spreadElement(originalParameters));
    const addParameter = t.expressionStatement(
      t.assignmentExpression('=', originalParameters, t.objectExpression(parameters))
    );
    csf._ast.program.body.push(addParameter);
  });
};

export const extractSource = (node: t.Node) => {
  const src = t.isVariableDeclarator(node) ? node.init : node;
  const { code } = generate.default(src, {});
  return code;
};

export const extractDescription = (node?: t.Node) => {
  if (node?.leadingComments) {
    const comments = node.leadingComments
      .map((comment) => {
        if (comment.type === 'CommentLine' || !comment.value.startsWith('*')) return null;
        return comment.value
          .split('\n')
          .map((line) => line.replace(/^(\s+)?(\*+)?(\s+)?/, ''))
          .join('\n')
          .trim();
      })
      .filter(Boolean);
    return comments.join('\n');
  }
  return '';
};
