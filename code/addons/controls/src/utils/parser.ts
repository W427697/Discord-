import { ReactParser } from './parser/react';

export type SupportedRenderer = 'react';

export type ParserResult = {
  exports: Array<{
    name: string;
    default: boolean;
  }>;
};

export interface Parser {
  parse: (content: string) => Promise<ParserResult>;
}

export function getParser(renderer: SupportedRenderer): Parser {
  switch (renderer) {
    case 'react':
      return new ReactParser();
    default:
      throw new Error(`Unsupported renderer: ${renderer}`);
  }
}
