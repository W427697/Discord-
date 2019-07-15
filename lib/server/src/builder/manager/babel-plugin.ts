import { transformFromAstAsync, Node, BabelFileResult } from '@babel/core';
import { RawSourceMap } from 'source-map';
import traverse, { NodePath } from '@babel/traverse';
import { parse } from '@babel/parser';
import * as t from '@babel/types';

const createAST = (source: string) => {
  return parse(source, { sourceType: 'module', plugins: ['jsx'] });
};

export interface Result {
  code: BabelFileResult['code'];
  map?: BabelFileResult['map'];
}

const shake = async (ast: Node, source: string, inputSourceMap: RawSourceMap) => {
  const { code, map } = await transformFromAstAsync(ast, source, {
    sourceType: 'module',
    inputSourceMap,
    sourceMaps: !!inputSourceMap,
    plugins: [
      'minify-dead-code-elimination',
      'babel-plugin-danger-remove-unused-import',
      '@wordpress/babel-plugin-import-jsx-pragma',
    ],
    presets: ['@babel/preset-react'],
  });
  return { code, map };
};

export const transform = async (
  source: string,
  map: RawSourceMap,
  options: {} = {}
): Promise<Result> => {
  const ast = createAST(source);

  let hasExports = false;

  traverse(ast, {
    ExportDefaultDeclaration(path) {
      hasExports = true;
      const declaration = path.get('declaration');

      if (t.isObjectExpression(declaration)) {
        (declaration as NodePath<t.ObjectExpression>)
          .get('properties')
          .forEach((p1: NodePath<t.ObjectProperty>) => {
            // @ts-ignore
            if (p1.get('key.name').node === 'parameters') {
              const value = p1.get('value');
              if (t.isObjectExpression(value)) {
                [].concat(value.get('properties')).forEach((p2: NodePath<t.ObjectProperty>) => {
                  // @ts-ignore
                  if (p2.get('key.name').node === 'component') {
                    p2.remove();
                  }
                });
              }
            }
            // @ts-ignore
            if (p1.get('key.name').node === 'decorators') {
              p1.remove();
            }
          });
      }
    },
    ExpressionStatement(path) {
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
    ExportNamedDeclaration(path) {
      hasExports = true;
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
  });

  if (hasExports) {
    return shake(ast, source, map);
  }
  return { code: '' };
};
