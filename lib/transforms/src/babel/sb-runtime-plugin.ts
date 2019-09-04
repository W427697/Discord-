import { transformFromAstAsync, Node, BabelFileResult } from '@babel/core';
import { RawSourceMap } from 'source-map';
import traverse from '@babel/traverse';
import { parse } from '@babel/parser';

import { visitorMerge } from '../utils/visitor-merge';
import { addFrameworkParameter, detectFramework } from '../modules/framework';
import { addRuntime } from '../modules/runtime';

const createAST = (source: string) => {
  return parse(source, {
    sourceType: 'module',
    plugins: ['typescript', 'dynamicImport', 'jsx'],
  });
};

export interface Result {
  code: BabelFileResult['code'];
  map: BabelFileResult['map'];
}

const shake = async (ast: Node, source: string, inputSourceMap: RawSourceMap) => {
  const { code, map } = await transformFromAstAsync(ast, source, {
    sourceType: 'module',
    inputSourceMap: inputSourceMap || undefined,
    sourceMaps: !!inputSourceMap,
    plugins: [
      // 'minify-dead-code-elimination',
      // 'babel-plugin-danger-remove-unused-import',
      // '@wordpress/babel-plugin-import-jsx-pragma',
    ],
  });
  return { code, map };
};

export const transform = async (
  source: string,
  map: RawSourceMap,
  options: {} = {}
): Promise<Result> => {
  const ast = createAST(source);

  const framework = detectFramework(ast);
  const visitor = visitorMerge(addFrameworkParameter(framework), addRuntime(framework));

  traverse(ast, visitor);

  return shake(ast, source, map);
};
