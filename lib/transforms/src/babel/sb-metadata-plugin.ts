import { transformFromAstAsync, Node, BabelFileResult } from '@babel/core';
import { RawSourceMap } from 'source-map';
import traverse, { TraverseOptions } from '@babel/traverse';
import { parse } from '@babel/parser';

import { visitorMerge } from '../utils/visitor-merge';
import { addFrameworkParameter, detectFramework } from '../modules/framework';
import { removeNonMetadata } from '../modules/metadata';

const createAST = (source: string) => {
  return parse(source, {
    sourceType: 'module',
    plugins: ['typescript', 'dynamicImport', 'jsx'],
  });
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

  const detectExportVisitor: TraverseOptions = {
    ExportNamedDeclaration() {
      hasExports = true;
    },
  };

  const framework = detectFramework(ast);
  const visitor = visitorMerge(
    addFrameworkParameter(framework),
    removeNonMetadata(framework),
    detectExportVisitor
  );

  traverse(ast, visitor);

  if (hasExports) {
    return shake(ast, source, map);
  }
  return { code: '' };
};
