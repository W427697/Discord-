import { transformFromAstAsync, Node, BabelFileResult } from '@babel/core';
import { RawSourceMap } from 'source-map';
import traverse from '@babel/traverse';
import { parse } from '@babel/parser';
import * as t from '@babel/types';

import { visitorMerge } from '../../transformer/__helper__/visitor-merge';
import { addFrameworkParameter } from '../../transformer/modules/framework';

const createAST = (source: string) => {
  return parse(source, { sourceType: 'module', plugins: ['jsx'] });
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

  const visitor = visitorMerge(addFrameworkParameter);

  traverse(ast, visitor);

  // 0) get a map of exports (including default)
  // 1) inject stories
  // 2) add HMR

  return shake(ast, source, map);
};
