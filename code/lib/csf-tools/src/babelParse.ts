import * as babelParser from '@babel/parser';
import * as recast from 'recast';
import type { ParserOptions } from '@babel/parser';

function parseWithFlowOrTypescript(source) {
  const flowCommentPattern = /^\s*\/\/\s*@flow/;
  const useFlowPlugin = flowCommentPattern.test(source);

  const parserPlugins = useFlowPlugin ? ['flow'] : ['typescript'];

  return babelParser.parse(source, {
    sourceType: 'module',
    plugins: parserPlugins,
  });
}

export const parserOptions: ParserOptions = {
  sourceType: 'module',
  // FIXME: we should get this from the project config somehow?
  plugins: ['jsx', 'decorators-legacy', 'classProperties'],
  tokens: true,
};

export const babelParse = (code: string) => {
  return recast.parse(code, {
    parser: {
      parse(source: string) {
        return parseWithFlowOrTypescript(source); // Use the custom parser function here
      },
    },
  });
};

export const babelParseExpression = (code: string) => {
  return babelParser.parseExpression(code, parserOptions);
};
