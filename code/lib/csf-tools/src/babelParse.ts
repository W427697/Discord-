import * as parser from '@babel/parser';
import * as recast from 'recast';
import type { ParserOptions } from '@babel/parser';

function parseWithFlowOrTypescript(source: string, parserOptions: babelParser.ParserOptions) {
  const flowCommentPattern = /^\s*\/\/\s*@flow/;
  const useFlowPlugin = flowCommentPattern.test(source);

  const parserPlugins: babelParser.ParserOptions['plugins'] = useFlowPlugin
    ? ['flow']
    : ['typescript'];

  // Merge the provided parserOptions with the custom parser plugins
  const mergedParserOptions = {
    ...parserOptions,
    plugins: [...(parserOptions.plugins ?? []), ...parserPlugins],
  };

  return babelParser.parse(source, mergedParserOptions);
}

export const parserOptions: ParserOptions = {
  sourceType: 'module',
  // FIXME: we should get this from the project config somehow?
  plugins: ['jsx', 'typescript', 'decorators-legacy', 'classProperties'],
  tokens: true,
};

export const babelParse = (code: string) => {
  return recast.parse(code, {
    parser: {
      parse(source: string) {
        return parser.parse(source, parserOptions);
      },
    },
  });
};

export const babelParseExpression = (code: string) => {
  return parser.parseExpression(code, parserOptions);
};
